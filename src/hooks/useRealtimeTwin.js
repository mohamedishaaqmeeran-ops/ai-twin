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

/* =========================================================
   HELPERS
========================================================= */

const getDefaultSocketUrl = () => {
  const configuredUrl =
    import.meta.env.VITE_REALTIME_WS_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL;

  if (apiUrl) {
    try {
      const parsedUrl =
        new URL(apiUrl);

      const protocol =
        parsedUrl.protocol === "https:"
          ? "wss:"
          : "ws:";

      return `${protocol}//${parsedUrl.host}/ws/realtime`;
    } catch (error) {
      console.error(
        "INVALID VITE_API_URL:",
        error
      );
    }
  }

  if (
    window.location.hostname ===
      "localhost" ||
    window.location.hostname ===
      "127.0.0.1"
  ) {
    return "ws://localhost:8000/ws/realtime";
  }

  throw new Error(
    "VITE_REALTIME_WS_URL is not configured for production."
  );
};

const getMessageEvent = (
  message
) => {
  return (
    message?.event ||
    message?.type ||
    ""
  );
};

const appendTranscript = (
  currentText,
  incomingText
) => {
  const normalizedCurrent =
    String(
      currentText || ""
    ).trim();

  const normalizedIncoming =
    String(
      incomingText || ""
    ).trim();

  if (!normalizedIncoming) {
    return normalizedCurrent;
  }

  if (!normalizedCurrent) {
    return normalizedIncoming;
  }

  if (
    normalizedIncoming.startsWith(
      normalizedCurrent
    )
  ) {
    return normalizedIncoming;
  }

  if (
    normalizedCurrent.endsWith(
      normalizedIncoming
    )
  ) {
    return normalizedCurrent;
  }

  return `${normalizedCurrent} ${normalizedIncoming}`;
};

/* =========================================================
   HOOK
========================================================= */

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

  const socketTokenRef =
    useRef(null);

  const userTranscriptRef =
    useRef("");

  const assistantTranscriptRef =
    useRef("");

  const mountedRef =
    useRef(true);

  const connectionPromiseRef =
    useRef(null);

  /* =======================================================
     PCM OUTPUT
  ======================================================= */

  const handleSpeakingChange =
    useCallback(
      (value) => {
        dispatch(
          setAssistantSpeaking(
            value
          )
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
    defaultSampleRate:
      24000,

    onSpeakingChange:
      handleSpeakingChange,
  });

  /* =======================================================
     SEND WEBSOCKET MESSAGE
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

  const sendSocketEventRef =
    useRef(
      sendSocketEvent
    );

  useEffect(() => {
    sendSocketEventRef.current =
      sendSocketEvent;
  }, [sendSocketEvent]);

  /* =======================================================
     MICROPHONE INPUT
  ======================================================= */

  const handleAudioChunk =
    useCallback(
      ({
        base64,
        mimeType,
      }) => {
        sendSocketEventRef.current(
          {
            event:
              "audio:input",

            type:
              "audio:input",

            audio:
              base64,

            mimeType,
          }
        );
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

  /* =======================================================
     RESET TRANSCRIPTS
  ======================================================= */

  const resetTranscripts =
    useCallback(() => {
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
    }, [dispatch]);

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

      socket.onopen =
        null;

      socket.onmessage =
        null;

      socket.onerror =
        null;

      socket.onclose =
        null;

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

      connectionPromiseRef.current =
        null;

      dispatch(
        setRealtimeConnected(
          false
        )
      );
    }, [dispatch]);

  /* =======================================================
     HANDLE COMPLETED CONVERSATION TURN
  ======================================================= */

  const completeConversationTurn =
    useCallback(() => {
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

      if (assistantText) {
        dispatch(
          appendRealtimeMessage({
            role:
              "assistant",

            text:
              assistantText,
          })
        );
      }

      resetTranscripts();
    }, [
      dispatch,
      resetTranscripts,
    ]);

  /* =======================================================
     CONNECT
  ======================================================= */

  const connect =
    useCallback(
      async ({
        twinId,
        productId,
        mode = "test",
        language = "English",
      }) => {
        if (!twinId) {
          throw new Error(
            "Twin ID is required."
          );
        }

        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

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
          if (
            connectionPromiseRef.current
          ) {
            return connectionPromiseRef.current;
          }

          throw new Error(
            "A realtime connection is already active."
          );
        }

        const connectionPromise =
          (async () => {
            dispatch(
              setRealtimeError(
                null
              )
            );

            dispatch(
              setRealtimeConnected(
                false
              )
            );

            resetTranscripts();

            dispatch(
              setConnectionStage(
                "creating-session"
              )
            );

            /*
             * Expected API response:
             *
             * {
             *   success: true,
             *   session: {
             *     _id,
             *     socketToken,
             *     ...
             *   },
             *   socketUrl?: "wss://..."
             * }
             */
            const result =
              await dispatch(
                createRealtimeSession({
                  twinId,
                  productId,
                  mode,
                  language,
                })
              ).unwrap();

            const session =
              result?.session ||
              result?.data
                ?.session ||
              null;

            const sessionId =
              session?._id ||
              session?.id;

            const socketToken =
              result?.socketToken ||
              session?.socketToken;

            const socketUrl =
              result?.socketUrl ||
              session?.socketUrl ||
              getDefaultSocketUrl();

            if (!sessionId) {
              throw new Error(
                "Realtime session ID was not returned."
              );
            }

            if (!socketToken) {
              throw new Error(
                "Realtime socket token was not returned."
              );
            }

            if (!socketUrl) {
              throw new Error(
                "Realtime WebSocket URL is not configured."
              );
            }

            sessionIdRef.current =
              sessionId;

            socketTokenRef.current =
              socketToken;

            dispatch(
              setConnectionStage(
                "connecting-socket"
              )
            );

            const separator =
              socketUrl.includes(
                "?"
              )
                ? "&"
                : "?";

            /*
             * Backend expects:
             *
             * /ws/realtime
             * ?sessionId=...
             * &socketToken=...
             */
            const completeUrl =
              `${socketUrl}${separator}` +
              `sessionId=${encodeURIComponent(
                sessionId
              )}` +
              `&socketToken=${encodeURIComponent(
                socketToken
              )}`;

            console.log(
              "CREATING WEBSOCKET:",
              completeUrl.replace(
                socketToken,
                "[REDACTED]"
              )
            );

            const socket =
              new WebSocket(
                completeUrl
              );

            socketRef.current =
              socket;

            socket.onopen =
              () => {
                console.log(
                  "BROWSER WEBSOCKET OPEN"
                );

                if (
                  !mountedRef.current
                ) {
                  return;
                }

                dispatch(
                  setConnectionStage(
                    "initializing-gemini"
                  )
                );

                /*
                 * Send both event and type
                 * for compatibility.
                 */
                sendSocketEventRef.current(
                  {
                    event:
                      "ping",

                    type:
                      "ping",
                  }
                );
              };

            socket.onmessage =
              async (
                event
              ) => {
                if (
                  !mountedRef.current
                ) {
                  return;
                }

                try {
                  const message =
                    JSON.parse(
                      event.data
                    );

                  const messageEvent =
                    getMessageEvent(
                      message
                    );

                  console.log(
                    "WEBSOCKET MESSAGE:",
                    messageEvent,
                    message
                  );

                  switch (
                    messageEvent
                  ) {
                    case "socket:connected":
                    case "gemini.connected": {
                      dispatch(
                        setConnectionStage(
                          "initializing-gemini"
                        )
                      );

                      dispatch(
                        setRealtimeError(
                          null
                        )
                      );

                      break;
                    }

                    case "pong": {
                      console.log(
                        "WEBSOCKET PONG"
                      );

                      break;
                    }

                    case "session:ready":
                    case "session.ready": {
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
                        setRealtimeError(
                          null
                        )
                      );

                      break;
                    }

                    case "audio:output":
                    case "audio.output": {
                      const audio =
                        message.audio ||
                        message.data
                          ?.audio;

                      if (!audio) {
                        break;
                      }

                      await playChunk(
                        audio,

                        Number(
                          message.sampleRate ||
                            message.data
                              ?.sampleRate ||
                            24000
                        )
                      );

                      break;
                    }

                    case "transcript:user":
                    case "transcript.user": {
                      const incomingText =
                        String(
                          message.text ||
                            message.data
                              ?.text ||
                            ""
                        );

                      if (
                        !incomingText
                      ) {
                        break;
                      }

                      const updatedText =
                        appendTranscript(
                          userTranscriptRef.current,
                          incomingText
                        );

                      userTranscriptRef.current =
                        updatedText;

                      dispatch(
                        setUserTranscript(
                          updatedText
                        )
                      );

                      break;
                    }

                    case "transcript:assistant":
                    case "transcript.assistant": {
                      const incomingText =
                        String(
                          message.text ||
                            message.data
                              ?.text ||
                            ""
                        );

                      if (
                        !incomingText
                      ) {
                        break;
                      }

                      const updatedText =
                        appendTranscript(
                          assistantTranscriptRef.current,
                          incomingText
                        );

                      assistantTranscriptRef.current =
                        updatedText;

                      dispatch(
                        setAssistantTranscript(
                          updatedText
                        )
                      );

                      break;
                    }

                    case "conversation:turn-complete":
                    case "conversation.turn-complete":
                    case "turn.complete": {
                      completeConversationTurn();

                      break;
                    }

                    case "conversation:interrupted":
                    case "conversation.interrupted": {
                      stopPlayback();

                      dispatch(
                        setAssistantSpeaking(
                          false
                        )
                      );

                      assistantTranscriptRef.current =
                        "";

                      dispatch(
                        setAssistantTranscript(
                          ""
                        )
                      );

                      break;
                    }

                    case "session:error":
                    case "session.error":
                    case "gemini.error": {
                      console.error(
                        "REALTIME SERVER ERROR:",
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
                          message.message ||
                            message.data
                              ?.message ||
                            "Realtime session error."
                        )
                      );

                      break;
                    }

                    case "gemini:closed":
                    case "gemini.closed": {
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
                            message.message ||
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
                } catch (
                  error
                ) {
                  console.error(
                    "WEBSOCKET MESSAGE ERROR:",
                    error
                  );

                  dispatch(
                    setRealtimeError(
                      error?.message ||
                        "Invalid realtime response."
                    )
                  );
                }
              };

            socket.onerror =
              (event) => {
                console.error(
                  "BROWSER WEBSOCKET ERROR:",
                  event
                );

                if (
                  !mountedRef.current
                ) {
                  return;
                }

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
                    "WebSocket connection failed."
                  )
                );
              };

            socket.onclose =
              (event) => {
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

                connectionPromiseRef.current =
                  null;

                if (
                  !mountedRef.current
                ) {
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
                  setAssistantSpeaking(
                    false
                  )
                );

                dispatch(
                  setConnectionStage(
                    event.code ===
                      1000
                      ? "closed"
                      : "failed"
                  )
                );

                if (
                  event.code !==
                  1000
                ) {
                  dispatch(
                    setRealtimeError(
                      `Realtime connection closed (${event.code}). ${
                        event.reason ||
                        ""
                      }`.trim()
                    )
                  );
                }
              };

            return result;
          })();

        connectionPromiseRef.current =
          connectionPromise;

        try {
          return await connectionPromise;
        } catch (error) {
          connectionPromiseRef.current =
            null;

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
              error?.message ||
                "Unable to connect realtime session."
            )
          );

          throw error;
        }
      },
      [
        completeConversationTurn,
        dispatch,
        playChunk,
        resetTranscripts,
        stopPlayback,
      ]
    );

  /* =======================================================
     START MICROPHONE
  ======================================================= */

  const startMicrophone =
    useCallback(
      async () => {
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

          type:
            "conversation:interrupt",
        });

        sendSocketEvent({
          event:
            "audio:start",

          type:
            "audio:start",
        });

        await startMicrophoneCapture();

        dispatch(
          setMicrophoneActive(
            true
          )
        );
      },
      [
        dispatch,
        realtime.connected,
        realtime.connectionStage,
        sendSocketEvent,
        startMicrophoneCapture,
        stopPlayback,
      ]
    );

  /* =======================================================
     STOP MICROPHONE
  ======================================================= */

  const stopMicrophone =
    useCallback(
      async () => {
        await stopMicrophoneCapture();

        sendSocketEvent({
          event:
            "audio:end",

          type:
            "audio:end",
        });

        dispatch(
          setMicrophoneActive(
            false
          )
        );
      },
      [
        dispatch,
        sendSocketEvent,
        stopMicrophoneCapture,
      ]
    );

  /* =======================================================
     SEND TEXT
  ======================================================= */

  const sendText =
    useCallback(
      (text) => {
        const normalized =
          String(
            text || ""
          ).trim();

        if (!normalized) {
          return false;
        }

        if (
          realtime.connectionStage !==
            "ready" ||
          !realtime.connected
        ) {
          dispatch(
            setRealtimeError(
              "Start the realtime session before sending a message."
            )
          );

          return false;
        }

        const sent =
          sendSocketEvent({
            event:
              "text:input",

            type:
              "text",

            text:
              normalized,

            message:
              normalized,
          });

        if (!sent) {
          dispatch(
            setRealtimeError(
              "Unable to send the message. WebSocket is not connected."
            )
          );

          return false;
        }

        /*
         * Display typed input immediately.
         */
        dispatch(
          appendRealtimeMessage({
            role: "user",
            text: normalized,
          })
        );

        userTranscriptRef.current =
          "";

        dispatch(
          setUserTranscript("")
        );

        return true;
      },
      [
        dispatch,
        realtime.connected,
        realtime.connectionStage,
        sendSocketEvent,
      ]
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

        type:
          "conversation:interrupt",
      });

      dispatch(
        setAssistantSpeaking(
          false
        )
      );
    }, [
      dispatch,
      sendSocketEvent,
      stopPlayback,
    ]);

  /* =======================================================
     DISCONNECT
  ======================================================= */

  const disconnect =
    useCallback(
      async () => {
        try {
          await stopMicrophoneCapture();
        } catch {
          // Ignore cleanup errors.
        }

        stopPlayback();

        sendSocketEvent({
          event:
            "session:stop",

          type:
            "session:stop",
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
          } catch (
            error
          ) {
            console.warn(
              "END REALTIME SESSION ERROR:",
              error
            );
          }
        }

        sessionIdRef.current =
          null;

        socketTokenRef.current =
          null;

        connectionPromiseRef.current =
          null;

        resetTranscripts();

        dispatch(
          setMicrophoneActive(
            false
          )
        );

        dispatch(
          setAssistantSpeaking(
            false
          )
        );

        dispatch(
          setRealtimeConnected(
            false
          )
        );

        dispatch(
          setConnectionStage(
            "closed"
          )
        );
      },
      [
        dispatch,
        disconnectSocket,
        resetTranscripts,
        sendSocketEvent,
        stopMicrophoneCapture,
        stopPlayback,
      ]
    );

  /* =======================================================
     UNMOUNT CLEANUP
  ======================================================= */

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;

      try {
        stopMicrophoneCapture();
      } catch {
        // Ignore cleanup errors.
      }

      stopPlayback();

      try {
        closePlayer();
      } catch {
        // Ignore cleanup errors.
      }

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

      socketRef.current =
        null;

      sessionIdRef.current =
        null;

      socketTokenRef.current =
        null;

      connectionPromiseRef.current =
        null;
    };
  }, [
    closePlayer,
    stopMicrophoneCapture,
    stopPlayback,
  ]);

  /* =======================================================
     RETURN
  ======================================================= */

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
      resetTranscripts();

      dispatch(
        clearRealtimeState()
      );
    },
  };
}