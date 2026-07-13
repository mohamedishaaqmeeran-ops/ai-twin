import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  appendRealtimeMessage,
  clearRealtimeState,
  createRealtimeSession,
  endRealtimeSession,
  setAssistantSpeaking,
  setAssistantTranscript,
  setMicrophoneActive,
  setRealtimeConnected,
  setRealtimeError,
  setUserTranscript,
} from "../features/realtime/realtimeSlice";

import useMicrophonePcm from "./useMicrophonePcm";
import usePcmPlayer from "./usePcmPlayer";

export default function useRealtimeTwin() {
  const dispatch =
    useDispatch();

  const realtime =
    useSelector(
      (state) =>
        state.realtime
    );

  const socketRef =
    useRef(null);

  const sessionIdRef =
    useRef(null);

  const userTranscriptRef =
    useRef("");

  const assistantTranscriptRef =
    useRef("");

  const {
    speaking,
    playChunk,
    stopPlayback,
    closePlayer,
  } = usePcmPlayer({
    defaultSampleRate:
      24000,

    onSpeakingChange:
      (value) => {
        dispatch(
          setAssistantSpeaking(
            value
          )
        );
      },
  });

  /* =======================================================
     SEND WEBSOCKET EVENT
  ======================================================= */

  const sendSocketEvent =
    useCallback(
      (payload) => {
        const socket =
          socketRef.current;

        if (
          !socket ||
          socket.readyState !==
            WebSocket.OPEN
        ) {
          return false;
        }

        socket.send(
          JSON.stringify(
            payload
          )
        );

        return true;
      },
      []
    );

  /* =======================================================
     MICROPHONE
  ======================================================= */

  const {
    recording,
    permission,
    start:
      startMicrophoneCapture,
    stop:
      stopMicrophoneCapture,
  } = useMicrophonePcm({
    onAudioChunk: ({
      base64,
      mimeType,
    }) => {
      sendSocketEvent({
        event:
          "audio:input",

        audio: base64,

        mimeType,
      });
    },

    onError: (error) => {
      dispatch(
        setRealtimeError(
          error.message ||
            "Microphone error."
        )
      );
    },
  });

  /* =======================================================
     DISCONNECT SOCKET
  ======================================================= */

  const disconnectSocket =
    useCallback(() => {
      const socket =
        socketRef.current;

      if (!socket) {
        return;
      }

      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState ===
          WebSocket.OPEN ||
        socket.readyState ===
          WebSocket.CONNECTING
      ) {
        socket.close(
          1000,
          "Client disconnected"
        );
      }

      socketRef.current =
        null;

      dispatch(
        setRealtimeConnected(
          false
        )
      );
    }, [dispatch]);

  /* =======================================================
     CONNECT
  ======================================================= */

  const connect =
    useCallback(
      async ({
        twinId,
        productId = null,
        mode = "test",
        language = "English",
      }) => {
        dispatch(
          setRealtimeError(null)
        );

        if (
          socketRef.current
        ) {
          disconnectSocket();
        }

        const result =
          await dispatch(
            createRealtimeSession({
              twinId,
              productId,
              mode,
              language,
            })
          ).unwrap();

        const sessionId =
          result.session?._id;

        const socketUrl =
          result.socketUrl;

        const socketToken =
          result.socketToken;

        if (!sessionId) {
          throw new Error(
            "Backend did not return a realtime session ID."
          );
        }

        if (
          !socketUrl ||
          !socketToken
        ) {
          throw new Error(
            "Backend did not return WebSocket connection information."
          );
        }

        sessionIdRef.current =
          sessionId;

        const separator =
          socketUrl.includes("?")
            ? "&"
            : "?";

        const completeUrl =
          `${socketUrl}${separator}token=${encodeURIComponent(
            socketToken
          )}`;

        const socket =
          new WebSocket(
            completeUrl
          );

        socketRef.current =
          socket;

        socket.onopen =
          () => {
            dispatch(
              setRealtimeConnected(
                true
              )
            );

            sendSocketEvent({
              event: "ping",
            });
          };

        socket.onmessage =
          async (event) => {
            try {
              const message =
                JSON.parse(
                  event.data
                );

              switch (
                message.event
              ) {
                case "session:ready": {
                  dispatch(
                    setRealtimeConnected(
                      true
                    )
                  );

                  break;
                }

                case "pong": {
                  break;
                }

                case "audio:output": {
                  await playChunk(
                    message.audio,

                    Number(
                      message.sampleRate ||
                        24000
                    )
                  );

                  break;
                }

                case "transcript:user": {
                  const transcript =
                    String(
                      message.text ||
                        ""
                    );

                  userTranscriptRef.current =
                    transcript;

                  dispatch(
                    setUserTranscript(
                      transcript
                    )
                  );

                  break;
                }

                case "transcript:assistant": {
                  const transcript =
                    String(
                      message.text ||
                        ""
                    );

                  assistantTranscriptRef.current =
                    transcript;

                  dispatch(
                    setAssistantTranscript(
                      transcript
                    )
                  );

                  break;
                }

                case "conversation:turn-complete": {
                  const userText =
                    userTranscriptRef.current.trim();

                  const assistantText =
                    assistantTranscriptRef.current.trim();

                  if (userText) {
                    dispatch(
                      appendRealtimeMessage({
                        role: "user",
                        text:
                          userText,
                      })
                    );
                  }

                  if (
                    assistantText
                  ) {
                    dispatch(
                      appendRealtimeMessage({
                        role:
                          "assistant",

                        text:
                          assistantText,
                      })
                    );
                  }

                  userTranscriptRef.current =
                    "";

                  assistantTranscriptRef.current =
                    "";

                  dispatch(
                    setUserTranscript(
                      ""
                    )
                  );

                  dispatch(
                    setAssistantTranscript(
                      ""
                    )
                  );

                  break;
                }

                case "conversation:interrupted": {
                  stopPlayback();

                  dispatch(
                    setAssistantSpeaking(
                      false
                    )
                  );

                  break;
                }

                case "session:error": {
                  dispatch(
                    setRealtimeError(
                      message.message ||
                        "Realtime session error."
                    )
                  );

                  break;
                }

                case "gemini:closed": {
                  dispatch(
                    setRealtimeConnected(
                      false
                    )
                  );

                  break;
                }

                default: {
                  console.log(
                    "Unhandled realtime message:",
                    message
                  );
                }
              }
            } catch (error) {
              dispatch(
                setRealtimeError(
                  error.message ||
                    "Unable to process realtime response."
                )
              );
            }
          };

        socket.onerror =
          () => {
            dispatch(
              setRealtimeConnected(
                false
              )
            );

            dispatch(
              setRealtimeError(
                "Unable to connect to realtime WebSocket."
              )
            );
          };

        socket.onclose =
          (event) => {
            dispatch(
              setRealtimeConnected(
                false
              )
            );

            dispatch(
              setMicrophoneActive(
                false
              )
            );

            if (
              event.code !==
              1000
            ) {
              dispatch(
                setRealtimeError(
                  event.reason ||
                    "Realtime connection closed unexpectedly."
                )
              );
            }
          };

        return result;
      },
      [
        dispatch,
        disconnectSocket,
        playChunk,
        sendSocketEvent,
        stopPlayback,
      ]
    );

  /* =======================================================
     START MICROPHONE
  ======================================================= */

  const startMicrophone =
    useCallback(async () => {
      if (
        !socketRef.current ||
        socketRef.current
          .readyState !==
          WebSocket.OPEN
      ) {
        throw new Error(
          "Start the realtime session first."
        );
      }

      /*
       * Stop current Gemini audio so the
       * customer can interrupt the AI.
       */
      stopPlayback();

      sendSocketEvent({
        event:
          "conversation:interrupt",
      });

      sendSocketEvent({
        event: "audio:start",
      });

      await startMicrophoneCapture();

      dispatch(
        setMicrophoneActive(
          true
        )
      );
    }, [
      dispatch,
      sendSocketEvent,
      startMicrophoneCapture,
      stopPlayback,
    ]);

  /* =======================================================
     STOP MICROPHONE
  ======================================================= */

  const stopMicrophone =
    useCallback(async () => {
      await stopMicrophoneCapture();

      sendSocketEvent({
        event: "audio:end",
      });

      dispatch(
        setMicrophoneActive(
          false
        )
      );
    }, [
      dispatch,
      sendSocketEvent,
      stopMicrophoneCapture,
    ]);

  /* =======================================================
     SEND TEXT
  ======================================================= */

  const sendText =
    useCallback(
      (text) => {
        const normalized =
          String(text || "")
            .trim();

        if (!normalized) {
          return false;
        }

        return sendSocketEvent({
          event:
            "text:input",

          text: normalized,
        });
      },
      [sendSocketEvent]
    );

  /* =======================================================
     INTERRUPT
  ======================================================= */

  const interrupt =
    useCallback(() => {
      stopPlayback();

      sendSocketEvent({
        event:
          "conversation:interrupt",
      });
    }, [
      sendSocketEvent,
      stopPlayback,
    ]);

  /* =======================================================
     DISCONNECT
  ======================================================= */

  const disconnect =
    useCallback(async () => {
      try {
        await stopMicrophoneCapture();
      } catch {
        // Ignore cleanup error.
      }

      stopPlayback();

      sendSocketEvent({
        event:
          "session:stop",
      });

      disconnectSocket();

      const sessionId =
        sessionIdRef.current;

      if (sessionId) {
        try {
          await dispatch(
            endRealtimeSession(
              sessionId
            )
          ).unwrap();
        } catch {
          /*
           * The WebSocket close handler may
           * already have ended the session.
           */
        }
      }

      sessionIdRef.current =
        null;
    }, [
      dispatch,
      disconnectSocket,
      sendSocketEvent,
      stopMicrophoneCapture,
      stopPlayback,
    ]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      stopMicrophoneCapture()
        .catch(() => {});

      closePlayer()
        .catch(() => {});

      disconnectSocket();
    };
  }, [
    closePlayer,
    disconnectSocket,
    stopMicrophoneCapture,
  ]);

  return {
    ...realtime,

    recording,
    permission,
    speaking,

    connect,
    disconnect,

    startMicrophone,
    stopMicrophone,

    sendText,
    interrupt,

    clear: () => {
      dispatch(
        clearRealtimeState()
      );
    },
  };
}