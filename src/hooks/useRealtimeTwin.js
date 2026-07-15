
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
   PRODUCTION CONFIGURATION
========================================================= */

const REALTIME_SOCKET_URL =
  "wss://twinn-backend.onrender.com/ws/realtime";

const REALTIME_READY_TIMEOUT =
  30000;

/* =========================================================
   HELPERS
========================================================= */

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

  /*
   * Gemini may send cumulative
   * transcription.
   */
  if (
    normalizedIncoming.startsWith(
      normalizedCurrent
    )
  ) {
    return normalizedIncoming;
  }

  /*
   * Avoid duplicating the same
   * fragment.
   */
  if (
    normalizedCurrent.endsWith(
      normalizedIncoming
    )
  ) {
    return normalizedCurrent;
  }

  return `${normalizedCurrent} ${normalizedIncoming}`;
};

const createDeferredPromise =
  () => {
    let resolve;
    let reject;

    const promise =
      new Promise(
        (
          resolvePromise,
          rejectPromise
        ) => {
          resolve =
            resolvePromise;

          reject =
            rejectPromise;
        }
      );

    return {
      promise,
      resolve,
      reject,
    };
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

  /* =======================================================
     REFS
  ======================================================= */

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

  const readyDeferredRef =
    useRef(null);

  const readyTimeoutRef =
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
     CLEAR READY WAIT
  ======================================================= */

  const clearReadyWait =
    useCallback(() => {
      if (
        readyTimeoutRef.current
      ) {
        clearTimeout(
          readyTimeoutRef.current
        );

        readyTimeoutRef.current =
          null;
      }

      readyDeferredRef.current =
        null;
    }, []);

  /* =======================================================
     REJECT READY WAIT
  ======================================================= */

  const rejectReadyWait =
    useCallback(
      (error) => {
        const deferred =
          readyDeferredRef.current;

        if (deferred) {
          deferred.reject(
            error instanceof Error
              ? error
              : new Error(
                  String(
                    error ||
                      "Realtime connection failed."
                  )
                )
          );
        }

        clearReadyWait();
      },
      [clearReadyWait]
    );

  /* =======================================================
     RESOLVE READY WAIT
  ======================================================= */

  const resolveReadyWait =
    useCallback(
      (value) => {
        const deferred =
          readyDeferredRef.current;

        if (deferred) {
          deferred.resolve(
            value
          );
        }

        clearReadyWait();
      },
      [clearReadyWait]
    );

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
      if (!base64) {
        return;
      }

      console.log(
        "MIC AUDIO CHUNK:",
        {
          length:
            base64.length,

          mimeType,
        }
      );

      const sent =
        sendSocketEventRef.current({
          event:
            "audio:input",

          type:
            "audio:input",

          audio:
            base64,

          mimeType:
            mimeType ||
            "audio/pcm;rate=16000",
        });

      if (!sent) {
        console.warn(
          "MIC AUDIO CHUNK NOT SENT: WebSocket is unavailable."
        );
      }
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
     COMPLETE TURN
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
     DISCONNECT SOCKET
  ======================================================= */

  const disconnectSocket =
    useCallback(
      ({
        code = 1000,
        reason =
          "Client disconnected",
      } = {}) => {
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
            code,
            reason
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
      },
      [dispatch]
    );

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
             * Create backend realtime
             * session.
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

            sessionIdRef.current =
              sessionId;

            socketTokenRef.current =
              socketToken;

            dispatch(
              setConnectionStage(
                "connecting-socket"
              )
            );

            const completeUrl =
              `${REALTIME_SOCKET_URL}` +
              `?sessionId=${encodeURIComponent(
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

            const readyDeferred =
              createDeferredPromise();

            readyDeferredRef.current =
              readyDeferred;

            readyTimeoutRef.current =
              setTimeout(
                () => {
                  rejectReadyWait(
                    new Error(
                      "Realtime connection timed out while waiting for Gemini."
                    )
                  );

                  disconnectSocket({
                    code: 1000,
                    reason:
                      "Realtime timeout",
                  });

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
                      "Realtime connection timed out."
                    )
                  );
                },
                REALTIME_READY_TIMEOUT
              );

            const socket =
              new WebSocket(
                completeUrl
              );

            socketRef.current =
              socket;

            /* =============================================
               SOCKET OPEN
            ============================================= */

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

                sendSocketEventRef.current(
                  {
                    event:
                      "ping",

                    type:
                      "ping",
                  }
                );
              };

            /* =============================================
               SOCKET MESSAGE
            ============================================= */

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
                    case "socket.connected":
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

                      resolveReadyWait({
                        ...result,

                        session: {
                          ...session,

                          _id:
                            sessionId,

                          socketToken,
                        },

                        readyMessage:
                          message,
                      });

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

                      assistantTranscriptRef.current =
                        "";

                      dispatch(
                        setAssistantTranscript(
                          ""
                        )
                      );

                      dispatch(
                        setAssistantSpeaking(
                          false
                        )
                      );

                      break;
                    }

                    case "session:error":
                    case "session.error":
                    case "gemini.error": {
                      const errorMessage =
                        message.message ||
                        message.data
                          ?.message ||
                        "Realtime session error.";

                      console.error(
                        "REALTIME SERVER ERROR:",
                        message
                      );

                      rejectReadyWait(
                        new Error(
                          errorMessage
                        )
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
                          errorMessage
                        )
                      );

                      break;
                    }

                    case "gemini:closed":
                    case "gemini.closed": {
                      const closeMessage =
                        message.reason ||
                        message.message ||
                        "Gemini Live closed.";

                      console.error(
                        "GEMINI CLOSED:",
                        message
                      );

                      rejectReadyWait(
                        new Error(
                          closeMessage
                        )
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
                          closeMessage
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

                  rejectReadyWait(
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

            /* =============================================
               SOCKET ERROR
            ============================================= */

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

                const error =
                  new Error(
                    "WebSocket connection failed."
                  );

                rejectReadyWait(
                  error
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
                    error.message
                  )
                );
              };

            /* =============================================
               SOCKET CLOSE
            ============================================= */

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

                const normalClose =
                  event.code ===
                  1000;

                dispatch(
                  setConnectionStage(
                    normalClose
                      ? "closed"
                      : "failed"
                  )
                );

                if (!normalClose) {
                  const closeMessage =
                    `Realtime connection closed (${event.code}). ${
                      event.reason ||
                      ""
                    }`.trim();

                  rejectReadyWait(
                    new Error(
                      closeMessage
                    )
                  );

                  dispatch(
                    setRealtimeError(
                      closeMessage
                    )
                  );
                }
              };

            /*
             * Do not return immediately.
             *
             * Wait until backend sends
             * session:ready.
             */
            return await readyDeferred
              .promise;
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
        disconnectSocket,
        playChunk,
        rejectReadyWait,
        resetTranscripts,
        resolveReadyWait,
        stopPlayback,
      ]
    );

  /* =======================================================
     START MICROPHONE
  ======================================================= */

  const startMicrophone =
  useCallback(
    async () => {
      try {
        if (
          realtime.connectionStage !==
            "ready" ||
          !realtime.connected
        ) {
          throw new Error(
            "Gemini Live is not ready."
          );
        }

        console.log(
          "MICROPHONE FUNCTION CHECK:",
          {
            startMicrophoneCapture:
              typeof startMicrophoneCapture,

            stopPlayback:
              typeof stopPlayback,

            sendSocketEvent:
              typeof sendSocketEvent,
          }
        );

        if (
          typeof startMicrophoneCapture !==
          "function"
        ) {
          throw new Error(
            "Microphone start function is unavailable."
          );
        }

        if (
          typeof stopPlayback ===
          "function"
        ) {
          stopPlayback();
        }

        const interruptSent =
          sendSocketEvent({
            event:
              "conversation:interrupt",

            type:
              "conversation:interrupt",
          });

        const audioStartSent =
          sendSocketEvent({
            event:
              "audio:start",

            type:
              "audio:start",
          });

        if (
          !interruptSent ||
          !audioStartSent
        ) {
          throw new Error(
            "WebSocket is not ready for microphone audio."
          );
        }

        await startMicrophoneCapture();

        dispatch(
          setMicrophoneActive(
            true
          )
        );
      } catch (error) {
        console.error(
          "START MICROPHONE ERROR:",
          error
        );

        dispatch(
          setMicrophoneActive(
            false
          )
        );

        dispatch(
          setRealtimeError(
            error?.message ||
              "Unable to start microphone."
          )
        );

        throw error;
      }
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
      try {
        if (
          typeof stopMicrophoneCapture ===
          "function"
        ) {
          await stopMicrophoneCapture();
        }

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
      } catch (error) {
        console.error(
          "STOP MICROPHONE ERROR:",
          error
        );

        dispatch(
          setMicrophoneActive(
            false
          )
        );

        dispatch(
          setRealtimeError(
            error?.message ||
              "Unable to stop microphone."
          )
        );
      }
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
         * Display typed messages
         * immediately.
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

        clearReadyWait();

        disconnectSocket({
          code: 1000,
          reason:
            "User ended session",
        });

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
        clearReadyWait,
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

      clearReadyWait();

      try {
        stopMicrophoneCapture();
      } catch {
        // Ignore cleanup error.
      }

      stopPlayback();

      try {
        closePlayer();
      } catch {
        // Ignore cleanup error.
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
    clearReadyWait,
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
