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
  setConnectionStage,
  setMicrophoneActive,
  setRealtimeConnected,
  setRealtimeError,
  setUserTranscript,
} from "../features/realtime/realtimeSlice";

import useMicrophonePcm from "./useMicrophonePcm";
import usePcmPlayer from "./usePcmPlayer";

export default function useRealtimeTwin() {
  const dispatch = useDispatch();

  const realtime = useSelector(
    (state) => state.realtime
  );

  const socketRef = useRef(null);

  const sessionIdRef =
    useRef(null);

  const userTranscriptRef =
    useRef("");

  const assistantTranscriptRef =
    useRef("");

  const mountedRef =
    useRef(true);

  /*
   * Stable callback.
   * Do not pass a new inline function
   * into usePcmPlayer on every render.
   */
  const handleSpeakingChange =
    useCallback(
      (value) => {
        dispatch(
          setAssistantSpeaking(value)
        );
      },
      [dispatch]
    );

  const {
    speaking,
    playChunk,
    stopPlayback,
    closePlayer,
  } = usePcmPlayer({
    defaultSampleRate: 24000,

    onSpeakingChange:
      handleSpeakingChange,
  });

  const sendSocketEvent =
    useCallback((payload) => {
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
        JSON.stringify(payload)
      );

      return true;
    }, []);

  /*
   * Use refs so microphone callbacks do
   * not depend on changing functions.
   */
  const sendSocketEventRef =
    useRef(sendSocketEvent);

  useEffect(() => {
    sendSocketEventRef.current =
      sendSocketEvent;
  }, [sendSocketEvent]);

  const handleAudioChunk =
    useCallback(
      ({
        base64,
        mimeType,
      }) => {
        sendSocketEventRef.current({
          event: "audio:input",
          audio: base64,
          mimeType,
        });
      },
      []
    );

  const handleMicrophoneError =
    useCallback(
      (error) => {
        dispatch(
          setRealtimeError(
            error?.message ||
              "Microphone error."
          )
        );
      },
      [dispatch]
    );

  const {
    recording,
    permission,

    start:
      startMicrophoneCapture,

    stop:
      stopMicrophoneCapture,
  } = useMicrophonePcm({
    onAudioChunk:
      handleAudioChunk,

    onError:
      handleMicrophoneError,
  });

  const disconnectSocket =
    useCallback(() => {
      const socket =
        socketRef.current;

      if (!socket) {
        return;
      }

      /*
       * Remove handlers before closing,
       * preventing stale callbacks.
       */
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

      socketRef.current = null;

      dispatch(
        setRealtimeConnected(false)
      );
    }, [dispatch]);

  const connect = useCallback(
    async ({
      twinId,
      productId = null,
      mode = "test",
      language = "English",
    }) => {
      /*
       * Prevent duplicate connections.
       */
      if (
        socketRef.current &&
        [
          WebSocket.OPEN,
          WebSocket.CONNECTING,
        ].includes(
          socketRef.current
            .readyState
        )
      ) {
        return;
      }

      dispatch(
        setRealtimeError(null)
      );

      dispatch(
        setConnectionStage(
          "creating-session"
        )
      );

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
          "Realtime session ID was not returned."
        );
      }

      if (
        !socketUrl ||
        !socketToken
      ) {
        throw new Error(
          "WebSocket connection information was not returned."
        );
      }

      sessionIdRef.current =
        sessionId;

      dispatch(
        setConnectionStage(
          "connecting-socket"
        )
      );

      const separator =
        socketUrl.includes("?")
          ? "&"
          : "?";

      const completeUrl =
        `${socketUrl}${separator}token=${encodeURIComponent(
          socketToken
        )}`;

      console.log(
        "CREATING WEBSOCKET:",
        socketUrl
      );

      const socket =
        new WebSocket(
          completeUrl
        );

      socketRef.current =
        socket;

      socket.onopen = () => {
        console.log(
          "BROWSER WEBSOCKET OPEN"
        );

        if (!mountedRef.current) {
          return;
        }

        dispatch(
          setConnectionStage(
            "initializing-gemini"
          )
        );

        sendSocketEventRef.current({
          event: "ping",
        });
      };

      socket.onmessage =
        async (event) => {
          if (!mountedRef.current) {
            return;
          }

          try {
            const message =
              JSON.parse(
                event.data
              );

            console.log(
              "WEBSOCKET MESSAGE:",
              message.event
            );

            switch (
              message.event
            ) {
              case "socket:connected": {
                dispatch(
                  setConnectionStage(
                    "initializing-gemini"
                  )
                );

                dispatch(
                  setRealtimeError(null)
                );

                break;
              }

              case "pong": {
                console.log(
                  "WEBSOCKET PONG:",
                  message
                );

                break;
              }

              case "session:ready": {
                console.log(
                  "GEMINI SESSION READY:",
                  message
                );

                dispatch(
                  setRealtimeConnected(
                    true
                  )
                );

                dispatch(
                  setConnectionStage(
                    "ready"
                  )
                );

                dispatch(
                  setRealtimeError(null)
                );

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
                    message.text || ""
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
                    message.text || ""
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
                      text: userText,
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
                  setUserTranscript("")
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
                console.error(
                  "REALTIME SERVER ERROR:",
                  message
                );

                dispatch(
                  setConnectionStage(
                    "failed"
                  )
                );

                dispatch(
                  setRealtimeError(
                    message.message ||
                      "Realtime session error."
                  )
                );

                break;
              }

              case "gemini:closed": {
                console.error(
                  "GEMINI CLOSED:",
                  message
                );

                dispatch(
                  setRealtimeConnected(
                    false
                  )
                );

                dispatch(
                  setConnectionStage(
                    "failed"
                  )
                );

                dispatch(
                  setRealtimeError(
                    message.reason ||
                      "Gemini Live closed."
                  )
                );

                break;
              }

              default: {
                console.log(
                  "Unhandled realtime event:",
                  message
                );
              }
            }
          } catch (error) {
            console.error(
              "WEBSOCKET MESSAGE ERROR:",
              error
            );

            dispatch(
              setRealtimeError(
                error.message ||
                  "Invalid realtime response."
              )
            );
          }
        };

      socket.onerror = (
        event
      ) => {
        console.error(
          "BROWSER WEBSOCKET ERROR:",
          event
        );

        if (!mountedRef.current) {
          return;
        }

        dispatch(
          setConnectionStage(
            "failed"
          )
        );

        dispatch(
          setRealtimeError(
            "WebSocket connection failed."
          )
        );
      };

      socket.onclose = (
        event
      ) => {
        console.error(
          "BROWSER WEBSOCKET CLOSED:",
          {
            code:
              event.code,

            reason:
              event.reason,

            wasClean:
              event.wasClean,
          }
        );

        socketRef.current =
          null;

        if (!mountedRef.current) {
          return;
        }

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

        dispatch(
          setConnectionStage(
            event.code === 1000
              ? "closed"
              : "failed"
          )
        );

        if (
          event.code !== 1000
        ) {
          dispatch(
            setRealtimeError(
              `Realtime connection closed (${event.code}). ${
                event.reason || ""
              }`
            )
          );
        }
      };

      return result;
    },
    [
      dispatch,
      playChunk,
      stopPlayback,
    ]
  );

  const startMicrophone =
    useCallback(async () => {
      if (
        realtime.connectionStage !==
          "ready" ||
        !realtime.connected
      ) {
        throw new Error(
          "Gemini Live is not ready."
        );
      }

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
        setMicrophoneActive(true)
      );
    }, [
      dispatch,
      realtime.connected,
      realtime.connectionStage,
      sendSocketEvent,
      startMicrophoneCapture,
      stopPlayback,
    ]);

  const stopMicrophone =
    useCallback(async () => {
      await stopMicrophoneCapture();

      sendSocketEvent({
        event: "audio:end",
      });

      dispatch(
        setMicrophoneActive(false)
      );
    }, [
      dispatch,
      sendSocketEvent,
      stopMicrophoneCapture,
    ]);

  const sendText =
    useCallback(
      (text) => {
        const normalized =
          String(text || "").trim();

        if (
          !normalized ||
          realtime.connectionStage !==
            "ready"
        ) {
          return false;
        }

        return sendSocketEvent({
          event: "text:input",
          text: normalized,
        });
      },
      [
        realtime.connectionStage,
        sendSocketEvent,
      ]
    );

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

  const disconnect =
    useCallback(async () => {
      try {
        await stopMicrophoneCapture();
      } catch {
        // Ignore cleanup error.
      }

      stopPlayback();

      sendSocketEvent({
        event: "session:stop",
      });

      const sessionId =
        sessionIdRef.current;

      disconnectSocket();

      if (sessionId) {
        try {
          await dispatch(
            endRealtimeSession(
              sessionId
            )
          ).unwrap();
        } catch {
          // Socket close also ends it.
        }
      }

      sessionIdRef.current =
        null;

      dispatch(
        setConnectionStage(
          "closed"
        )
      );
    }, [
      dispatch,
      disconnectSocket,
      sendSocketEvent,
      stopMicrophoneCapture,
      stopPlayback,
    ]);

  /*
   * IMPORTANT:
   * This effect is intended to run cleanup
   * only when the component unmounts.
   *
   * The referenced functions are now stable.
   */
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      const socket =
        socketRef.current;

      if (
        socket &&
        [
          WebSocket.OPEN,
          WebSocket.CONNECTING,
        ].includes(
          socket.readyState
        )
      ) {
        socket.close(
          1000,
          "Component unmounted"
        );
      }

      socketRef.current = null;
    };
  }, []);

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