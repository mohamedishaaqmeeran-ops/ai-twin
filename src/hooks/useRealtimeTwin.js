import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  API_URL,
  apiRequest,
  toWebSocketUrl,
} from "../lib/api";

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const CHUNK_SIZE = 4096;

/* =========================================================
   EVENT HELPERS
========================================================= */

function getEvent(message) {
  return (
    message?.event ||
    message?.type ||
    ""
  );
}

function createId() {
  return (
    crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  );
}

/* =========================================================
   AUDIO HELPERS
========================================================= */

function arrayBufferToBase64(buffer) {
  const bytes =
    new Uint8Array(buffer);

  let binary = "";

  const size = 0x8000;

  for (
    let index = 0;
    index < bytes.length;
    index += size
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        index,
        index + size
      )
    );
  }

  return btoa(binary);
}

function base64ToInt16(base64) {
  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return new Int16Array(
    bytes.buffer
  );
}

function float32ToInt16(input) {
  const output =
    new Int16Array(
      input.length
    );

  for (
    let index = 0;
    index < input.length;
    index += 1
  ) {
    const sample =
      Math.max(
        -1,
        Math.min(
          1,
          input[index]
        )
      );

    output[index] =
      sample < 0
        ? sample * 0x8000
        : sample * 0x7fff;
  }

  return output;
}

function downsample(
  input,
  inputRate,
  outputRate
) {
  if (
    inputRate === outputRate
  ) {
    return input;
  }

  if (
    outputRate > inputRate
  ) {
    throw new Error(
      "Output sample rate must not exceed input sample rate."
    );
  }

  const ratio =
    inputRate / outputRate;

  const length =
    Math.round(
      input.length / ratio
    );

  const output =
    new Float32Array(
      length
    );

  let inputOffset = 0;

  for (
    let outputOffset = 0;
    outputOffset < length;
    outputOffset += 1
  ) {
    const nextOffset =
      Math.round(
        (outputOffset + 1) *
          ratio
      );

    let total = 0;
    let count = 0;

    while (
      inputOffset <
        nextOffset &&
      inputOffset <
        input.length
    ) {
      total +=
        input[inputOffset];

      count += 1;
      inputOffset += 1;
    }

    output[outputOffset] =
      count
        ? total / count
        : 0;
  }

  return output;
}

/* =========================================================
   MERGE TRANSCRIPT CHUNKS
========================================================= */

function mergeTranscript(
  previous,
  incoming
) {
  const current =
    String(
      previous || ""
    ).trim();

  const next =
    String(
      incoming || ""
    ).trim();

  if (!next) {
    return current;
  }

  if (!current) {
    return next;
  }

  /*
   * Gemini may send the complete accumulated
   * transcript instead of only the latest chunk.
   */
  if (
    next.startsWith(
      current
    )
  ) {
    return next;
  }

  if (
    current.startsWith(
      next
    )
  ) {
    return current;
  }

  /*
   * Avoid repeated chunks.
   */
  if (
    current.endsWith(
      next
    )
  ) {
    return current;
  }

  /*
   * Join punctuation without adding a space.
   */
  if (
    /^[,.;:!?)]/.test(
      next
    )
  ) {
    return `${current}${next}`;
  }

  if (
    /^['’]/.test(
      next
    )
  ) {
    return `${current}${next}`;
  }

  return `${current} ${next}`;
}

/* =========================================================
   HOOK
========================================================= */

export default function useRealtimeTwin() {
  /* =======================================================
     REFS
  ======================================================= */

  const socketRef =
    useRef(null);

  const sessionRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const inputContextRef =
    useRef(null);

  const sourceRef =
    useRef(null);

  const processorRef =
    useRef(null);

  const outputContextRef =
    useRef(null);

  const outputQueueRef =
    useRef([]);

  const outputPlayingRef =
    useRef(false);

  const currentOutputRef =
    useRef(null);

  const manualCloseRef =
    useRef(false);

  const userTranscriptRef =
    useRef("");

  const assistantTranscriptRef =
    useRef("");

  const lastTypedMessageRef =
    useRef("");

  const mountedRef =
    useRef(true);

  /* =======================================================
     STATE
  ======================================================= */

  const [
    session,
    setSession,
  ] = useState(null);

  const [
    status,
    setStatus,
  ] = useState("idle");

  const [
    connectionStage,
    setConnectionStage,
  ] = useState("idle");

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    recording,
    setRecording,
  ] = useState(false);

  const [
    speaking,
    setSpeaking,
  ] = useState(false);

  const [
    permission,
    setPermission,
  ] = useState("unknown");

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    userTranscript,
    setUserTranscript,
  ] = useState("");

  const [
    assistantTranscript,
    setAssistantTranscript,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     SEND SOCKET MESSAGE
  ======================================================= */

  const send =
    useCallback(
      (
        payload
      ) => {
        const socket =
          socketRef.current;

        if (
          !socket ||
          socket.readyState !==
            WebSocket.OPEN
        ) {
          return false;
        }

        try {
          socket.send(
            JSON.stringify(
              payload
            )
          );

          return true;
        } catch (
          sendError
        ) {
          console.error(
            "REALTIME SEND ERROR:",
            sendError
          );

          return false;
        }
      },
      []
    );

  /* =======================================================
     APPEND CHAT MESSAGE
  ======================================================= */

  const appendMessage =
    useCallback(
      (
        role,
        text,
        id
      ) => {
        const normalized =
          String(
            text || ""
          ).trim();

        if (
          !normalized ||
          ![
            "user",
            "assistant",
          ].includes(role)
        ) {
          return;
        }

        setMessages(
          (
            current
          ) => {
            const lastMessage =
              current[
                current.length -
                  1
              ];

            /*
             * Prevent duplicate final messages.
             */
            if (
              lastMessage &&
              lastMessage.role ===
                role &&
              lastMessage.text ===
                normalized
            ) {
              return current;
            }

            const nextMessages =
              [
                ...current,
                {
                  id:
                    id ||
                    createId(),

                  role,

                  text:
                    normalized,

                  createdAt:
                    new Date()
                      .toISOString(),
                },
              ];

            return nextMessages.slice(
              -100
            );
          }
        );
      },
      []
    );

  /* =======================================================
     OUTPUT AUDIO CONTEXT
  ======================================================= */

  const getOutputContext =
    useCallback(
      async () => {
        const AudioContextClass =
          window.AudioContext ||
          window.webkitAudioContext;

        if (
          !AudioContextClass
        ) {
          throw new Error(
            "Audio playback is unsupported in this browser."
          );
        }

        if (
          !outputContextRef.current ||
          outputContextRef
            .current
            .state ===
            "closed"
        ) {
          outputContextRef.current =
            new AudioContextClass({
              sampleRate:
                OUTPUT_SAMPLE_RATE,
            });
        }

        if (
          outputContextRef
            .current
            .state ===
          "suspended"
        ) {
          await outputContextRef
            .current
            .resume();
        }

        return outputContextRef.current;
      },
      []
    );


      /* =======================================================
     PLAY OUTPUT AUDIO QUEUE
  ======================================================= */

  const playNext =
    useCallback(
      async () => {
        if (
          outputPlayingRef
            .current
        ) {
          return;
        }

        const next =
          outputQueueRef
            .current
            .shift();

        if (!next) {
          if (
            mountedRef.current
          ) {
            setSpeaking(false);
          }

          return;
        }

        outputPlayingRef.current =
          true;

        if (
          mountedRef.current
        ) {
          setSpeaking(true);
        }

        try {
          const context =
            await getOutputContext();

          const pcm =
            base64ToInt16(
              next.audio
            );

          const floats =
            new Float32Array(
              pcm.length
            );

          for (
            let index = 0;
            index <
            pcm.length;
            index += 1
          ) {
            floats[index] =
              pcm[index] /
              32768;
          }

          const sampleRate =
            Number(
              next.sampleRate ||
                OUTPUT_SAMPLE_RATE
            );

          const buffer =
            context.createBuffer(
              1,
              floats.length,
              sampleRate
            );

          buffer
            .getChannelData(0)
            .set(floats);

          const source =
            context.createBufferSource();

          source.buffer =
            buffer;

          source.connect(
            context.destination
          );

          currentOutputRef.current =
            source;

          source.onended =
            () => {
              currentOutputRef.current =
                null;

              outputPlayingRef.current =
                false;

              playNext();
            };

          source.start();
        } catch (
          playbackError
        ) {
          console.error(
            "REALTIME AUDIO PLAYBACK ERROR:",
            playbackError
          );

          outputPlayingRef.current =
            false;

          if (
            mountedRef.current
          ) {
            setError(
              playbackError
                ?.message ||
                "Unable to play realtime audio."
            );
          }

          playNext();
        }
      },
      [
        getOutputContext,
      ]
    );

  const enqueueAudio =
    useCallback(
      (
        audio,
        sampleRate
      ) => {
        if (
          !audio ||
          typeof audio !==
            "string"
        ) {
          return;
        }

        outputQueueRef.current.push(
          {
            audio,

            sampleRate:
              sampleRate ||
              OUTPUT_SAMPLE_RATE,
          }
        );

        playNext();
      },
      [
        playNext,
      ]
    );

  /* =======================================================
     CLEAR AUDIO PLAYBACK
  ======================================================= */

  const clearPlayback =
    useCallback(
      () => {
        outputQueueRef.current =
          [];

        try {
          currentOutputRef
            .current
            ?.stop();
        } catch {
          // Output was already stopped.
        }

        currentOutputRef.current =
          null;

        outputPlayingRef.current =
          false;

        if (
          mountedRef.current
        ) {
          setSpeaking(false);
        }
      },
      []
    );

  /* =======================================================
     STOP MICROPHONE
  ======================================================= */

  const stopMicrophone =
    useCallback(
      async () => {
        const wasRecording =
          Boolean(
            processorRef.current ||
              streamRef.current
          );

        try {
          processorRef
            .current
            ?.disconnect();
        } catch {
          // Ignore disconnect error.
        }

        try {
          sourceRef
            .current
            ?.disconnect();
        } catch {
          // Ignore disconnect error.
        }

        processorRef.current =
          null;

        sourceRef.current =
          null;

        streamRef.current
          ?.getTracks()
          .forEach(
            (
              track
            ) => {
              track.stop();
            }
          );

        streamRef.current =
          null;

        if (
          inputContextRef
            .current &&
          inputContextRef
            .current
            .state !==
            "closed"
        ) {
          await inputContextRef
            .current
            .close()
            .catch(
              () => {}
            );
        }

        inputContextRef.current =
          null;

        if (
          mountedRef.current
        ) {
          setRecording(false);
        }

        if (wasRecording) {
          send({
            event:
              "audio:end",
          });
        }
      },
      [
        send,
      ]
    );

  /* =======================================================
     START MICROPHONE
  ======================================================= */

  const startMicrophone =
    useCallback(
      async () => {
        if (
          !connected ||
          connectionStage !==
            "ready"
        ) {
          throw new Error(
            "Gemini Live is not ready."
          );
        }

        if (recording) {
          return;
        }

        try {
          const stream =
            await navigator
              .mediaDevices
              .getUserMedia({
                audio: {
                  channelCount:
                    1,

                  echoCancellation:
                    true,

                  noiseSuppression:
                    true,

                  autoGainControl:
                    true,
                },
              });

          if (
            mountedRef.current
          ) {
            setPermission(
              "granted"
            );
          }

          streamRef.current =
            stream;

          const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

          if (
            !AudioContextClass
          ) {
            throw new Error(
              "Microphone audio is unsupported in this browser."
            );
          }

          const context =
            new AudioContextClass();

          if (
            context.state ===
            "suspended"
          ) {
            await context.resume();
          }

          inputContextRef.current =
            context;

          const source =
            context
              .createMediaStreamSource(
                stream
              );

          const processor =
            context
              .createScriptProcessor(
                CHUNK_SIZE,
                1,
                1
              );

          sourceRef.current =
            source;

          processorRef.current =
            processor;

          processor.onaudioprocess =
            (
              event
            ) => {
              if (
                !socketRef.current ||
                socketRef.current
                  .readyState !==
                  WebSocket.OPEN
              ) {
                return;
              }

              const input =
                event.inputBuffer
                  .getChannelData(
                    0
                  );

              const reduced =
                downsample(
                  input,
                  context.sampleRate,
                  INPUT_SAMPLE_RATE
                );

              const pcm =
                float32ToInt16(
                  reduced
                );

              const audio =
                arrayBufferToBase64(
                  pcm.buffer
                );

              send({
                event:
                  "audio:input",

                audio,

                data:
                  audio,

                mimeType:
                  `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,

                sampleRate:
                  INPUT_SAMPLE_RATE,
              });
            };

          source.connect(
            processor
          );

          processor.connect(
            context.destination
          );

          send({
            event:
              "audio:start",

            mimeType:
              `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,

            sampleRate:
              INPUT_SAMPLE_RATE,
          });

          if (
            mountedRef.current
          ) {
            setRecording(true);
          }
        } catch (
          microphoneError
        ) {
          console.error(
            "MICROPHONE ERROR:",
            microphoneError
          );

          if (
            mountedRef.current
          ) {
            setPermission(
              microphoneError
                ?.name ===
                "NotAllowedError"
                ? "denied"
                : "error"
            );
          }

          await stopMicrophone();

          throw microphoneError;
        }
      },
      [
        connected,
        connectionStage,
        recording,
        send,
        stopMicrophone,
      ]
    );

  /* =======================================================
     WEBSOCKET MESSAGE HANDLER
  ======================================================= */

  const handleMessage =
    useCallback(
      (
        event
      ) => {
        let message;

        try {
          message =
            JSON.parse(
              event.data
            );
        } catch (
          parseError
        ) {
          console.error(
            "INVALID REALTIME MESSAGE:",
            event.data,
            parseError
          );

          return;
        }

        const type =
          getEvent(
            message
          );

        console.log(
          "REALTIME EVENT:",
          type,
          message
        );

        /* ===============================
           SOCKET CONNECTED
        =============================== */

        if (
          type ===
          "socket:connected"
        ) {
          setConnected(true);

          setStatus(
            "connected"
          );

          setConnectionStage(
            "initializing-gemini"
          );

          return;
        }

        /* ===============================
           SESSION READY
        =============================== */

        if (
          type ===
          "session:ready"
        ) {
          setConnected(true);

          setStatus(
            "ready"
          );

          setConnectionStage(
            "ready"
          );

          setError("");

          return;
        }


                /* ===============================
           USER TRANSCRIPT
        =============================== */

        if (
          type ===
          "transcript:user"
        ) {
          const incomingText =
            String(
              message.text ||
                message.transcript ||
                message.data?.text ||
                ""
            ).trim();

          if (!incomingText) {
            return;
          }

          /*
           * Typed messages are already appended
           * immediately by sendText(). Ignore
           * the same text when Gemini echoes it.
           */
          if (
            incomingText ===
            lastTypedMessageRef.current
          ) {
            lastTypedMessageRef.current =
              "";

            userTranscriptRef.current =
              "";

            setUserTranscript("");

            return;
          }

          const completeText =
            message.completeText ||
            message.fullText ||
            message.data?.completeText ||
            message.data?.fullText ||
            "";

          const nextTranscript =
            completeText
              ? String(
                  completeText
                ).trim()
              : mergeTranscript(
                  userTranscriptRef.current,
                  incomingText
                );

          userTranscriptRef.current =
            nextTranscript;

          setUserTranscript(
            nextTranscript
          );

          const isFinal =
            message.final ===
              true ||
            message.isFinal ===
              true ||
            message.data?.final ===
              true ||
            message.data?.isFinal ===
              true;

          if (isFinal) {
            appendMessage(
              "user",
              nextTranscript
            );

            userTranscriptRef.current =
              "";

            setUserTranscript("");
          }

          return;
        }

        /* ===============================
           ASSISTANT TRANSCRIPT
        =============================== */

        if (
          type ===
          "transcript:assistant"
        ) {
          const incomingText =
            String(
              message.text ||
                message.transcript ||
                message.data?.text ||
                ""
            ).trim();

          if (!incomingText) {
            return;
          }

          const completeText =
            message.completeText ||
            message.fullText ||
            message.data?.completeText ||
            message.data?.fullText ||
            "";

          const nextTranscript =
            completeText
              ? String(
                  completeText
                ).trim()
              : mergeTranscript(
                  assistantTranscriptRef.current,
                  incomingText
                );

          assistantTranscriptRef.current =
            nextTranscript;

          setAssistantTranscript(
            nextTranscript
          );

          setSpeaking(true);

          const isFinal =
            message.final ===
              true ||
            message.isFinal ===
              true ||
            message.data?.final ===
              true ||
            message.data?.isFinal ===
              true;

          if (isFinal) {
            appendMessage(
              "assistant",
              nextTranscript
            );

            assistantTranscriptRef.current =
              "";

            setAssistantTranscript("");
          }

          return;
        }

        /* ===============================
           AUDIO OUTPUT
        =============================== */

        if (
          type ===
          "audio:output"
        ) {
          const audio =
            message.audio ||
            message.base64 ||
            message.data?.audio ||
            (
              typeof message.data ===
              "string"
                ? message.data
                : ""
            );

          const sampleRate =
            message.sampleRate ||
            message.data?.sampleRate ||
            OUTPUT_SAMPLE_RATE;

          enqueueAudio(
            audio,
            sampleRate
          );

          return;
        }

        /* ===============================
           TURN COMPLETE
        =============================== */

        if (
          type ===
          "conversation:turn-complete"
        ) {
          const completedUserText =
            userTranscriptRef.current
              .trim();

          const completedAssistantText =
            assistantTranscriptRef.current
              .trim();

          if (
            completedUserText
          ) {
            appendMessage(
              "user",
              completedUserText
            );
          }

          if (
            completedAssistantText
          ) {
            appendMessage(
              "assistant",
              completedAssistantText
            );
          }

          userTranscriptRef.current =
            "";

          assistantTranscriptRef.current =
            "";

          lastTypedMessageRef.current =
            "";

          setUserTranscript("");

          setAssistantTranscript("");

          if (
            outputQueueRef.current
              .length === 0 &&
            !outputPlayingRef.current
          ) {
            setSpeaking(false);
          }

          return;
        }

        /* ===============================
           INTERRUPTED
        =============================== */

        if (
          type ===
          "conversation:interrupted"
        ) {
          clearPlayback();

          assistantTranscriptRef.current =
            "";

          setAssistantTranscript("");

          setSpeaking(false);

          return;
        }

        /* ===============================
           UNSUPPORTED EVENT
        =============================== */

        if (
          type ===
          "event:unsupported"
        ) {
          console.warn(
            "UNSUPPORTED REALTIME EVENT:",
            message
          );

          return;
        }

        /* ===============================
           PONG
        =============================== */

        if (
          type ===
          "pong"
        ) {
          return;
        }

        /* ===============================
           SESSION CLOSED
        =============================== */

        if (
          type ===
          "session:closed"
        ) {
          setConnected(false);

          setRecording(false);

          setSpeaking(false);

          setStatus(
            "closed"
          );

          setConnectionStage(
            "closed"
          );

          return;
        }

        /* ===============================
           GEMINI CLOSED
        =============================== */

        if (
          type ===
          "gemini:closed"
        ) {
          setConnected(false);

          setRecording(false);

          setSpeaking(false);

          setStatus(
            "closed"
          );

          setConnectionStage(
            "closed"
          );

          return;
        }

        /* ===============================
           SESSION ERROR
        =============================== */

        if (
          type ===
          "session:error"
        ) {
          const messageText =
            message.message ||
            message.error ||
            message.data?.message ||
            "Realtime session error.";

          setError(
            messageText
          );

          setStatus(
            "error"
          );

          setConnectionStage(
            "error"
          );
        }
      },
      [
        appendMessage,
        clearPlayback,
        enqueueAudio,
      ]
    );

  /* =======================================================
     DISCONNECT
  ======================================================= */

  const disconnect =
    useCallback(
      async () => {
        manualCloseRef.current =
          true;

        await stopMicrophone();

        clearPlayback();

        const socket =
          socketRef.current;

        if (socket) {
          try {
            if (
              socket.readyState ===
                WebSocket.OPEN
            ) {
              socket.send(
                JSON.stringify({
                  event:
                    "session:end",
                })
              );
            }
          } catch {
            // Ignore final send error.
          }

          socket.onopen =
            null;

          socket.onmessage =
            null;

          socket.onerror =
            null;

          socket.onclose =
            null;

          try {
            socket.close(
              1000,
              "Client disconnected"
            );
          } catch {
            // Ignore close error.
          }
        }

        socketRef.current =
          null;

        const sessionId =
          sessionRef.current?._id;

        if (sessionId) {
          await fetch(
            `${API_URL}/api/realtime/sessions/${sessionId}/end`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          ).catch(
            (
              closeError
            ) => {
              console.error(
                "SESSION END ERROR:",
                closeError
              );
            }
          );
        }

        sessionRef.current =
          null;

        userTranscriptRef.current =
          "";

        assistantTranscriptRef.current =
          "";

        lastTypedMessageRef.current =
          "";

        if (
          mountedRef.current
        ) {
          setSession(null);

          setConnected(false);

          setRecording(false);

          setSpeaking(false);

          setStatus(
            "idle"
          );

          setConnectionStage(
            "idle"
          );

          setUserTranscript("");

          setAssistantTranscript("");
        }
      },
      [
        clearPlayback,
        stopMicrophone,
      ]
    );


      /* =======================================================
     CONNECT
  ======================================================= */

  const connect =
    useCallback(
      async ({
        twinId,
        productId,
        language =
          "English",
        mode =
          "test",
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

        await disconnect();

        manualCloseRef.current =
          false;

        userTranscriptRef.current =
          "";

        assistantTranscriptRef.current =
          "";

        lastTypedMessageRef.current =
          "";

        setMessages([]);

        setError("");

        setStatus(
          "creating"
        );

        setConnectionStage(
          "creating-session"
        );

        console.log(
          "STARTING REALTIME SESSION:",
          {
            twinId,
            productId,
            language,
            mode,
          }
        );

        const result =
          await apiRequest(
            "/api/realtime/sessions",
            {
              method:
                "POST",

              body:
                JSON.stringify({
                  twinId,
                  productId,
                  language,
                  mode,
                }),
            }
          );

        const returnedSession =
          result.session ||
          result.data?.session ||
          result.data ||
          {};

        const sessionId =
          returnedSession?._id ||
          returnedSession?.id ||
          result.sessionId ||
          result.data?.sessionId;

        if (!sessionId) {
          throw new Error(
            "Realtime session ID was not returned."
          );
        }

        const normalized =
          {
            ...returnedSession,

            _id:
              sessionId,

            twinId,

            productId,

            language,

            mode,
          };

        sessionRef.current =
          normalized;

        setSession(
          normalized
        );

        setConnectionStage(
          "connecting-socket"
        );

        const socketUrl =
          result.socketUrl ||
          result.data?.socketUrl ||
          returnedSession?.socketUrl ||
          `${toWebSocketUrl(
            API_URL
          )}/api/realtime/socket`;

        const socketToken =
          result.socketToken ||
          result.data?.socketToken ||
          returnedSession?.socketToken;

        if (!socketToken) {
          throw new Error(
            "Realtime socket token was not returned."
          );
        }

        const url =
          new URL(
            socketUrl
          );

        url.searchParams.set(
          "sessionId",
          sessionId
        );

        url.searchParams.set(
          "token",
          socketToken
        );

        console.log(
          "CONNECTING REALTIME SOCKET:",
          url.toString()
        );

        const socket =
          new WebSocket(
            url.toString()
          );

        socketRef.current =
          socket;

        await new Promise(
          (
            resolve,
            reject
          ) => {
            let settled =
              false;

            const timeout =
              window.setTimeout(
                () => {
                  if (
                    settled
                  ) {
                    return;
                  }

                  settled =
                    true;

                  try {
                    socket.close();
                  } catch {
                    // Ignore close error.
                  }

                  reject(
                    new Error(
                      "Realtime socket connection timed out."
                    )
                  );
                },
                20000
              );

            socket.onopen =
              () => {
                console.log(
                  "REALTIME SOCKET OPENED"
                );

                setConnected(
                  true
                );

                setStatus(
                  "connected"
                );

                setConnectionStage(
                  "initializing-gemini"
                );

                /*
                 * Backend may already initialize Gemini
                 * when the WebSocket connection opens.
                 * This event is safe as an optional
                 * compatibility event.
                 */
                send({
                  event:
                    "session:initialize",

                  sessionId,

                  twinId,

                  productId,

                  language,

                  mode,
                });
              };

            socket.onmessage =
              (
                socketEvent
              ) => {
                handleMessage(
                  socketEvent
                );

                try {
                  const parsed =
                    JSON.parse(
                      socketEvent.data
                    );

                  const eventType =
                    getEvent(
                      parsed
                    );

                  if (
                    eventType ===
                      "session:ready" &&
                    !settled
                  ) {
                    settled =
                      true;

                    window.clearTimeout(
                      timeout
                    );

                    resolve();
                  }

                  if (
                    eventType ===
                      "session:error" &&
                    !settled
                  ) {
                    settled =
                      true;

                    window.clearTimeout(
                      timeout
                    );

                    reject(
                      new Error(
                        parsed.message ||
                          "Realtime session initialization failed."
                      )
                    );
                  }
                } catch {
                  // handleMessage already handles parsing.
                }
              };

            socket.onerror =
              (
                socketError
              ) => {
                console.error(
                  "REALTIME SOCKET ERROR:",
                  socketError
                );

                if (
                  !settled
                ) {
                  settled =
                    true;

                  window.clearTimeout(
                    timeout
                  );

                  reject(
                    new Error(
                      "Realtime socket connection failed."
                    )
                  );
                }
              };

            socket.onclose =
              (
                closeEvent
              ) => {
                console.error(
                  "REALTIME SOCKET CLOSED:",
                  {
                    code:
                      closeEvent.code,

                    reason:
                      closeEvent.reason,

                    wasClean:
                      closeEvent.wasClean,
                  }
                );

                window.clearTimeout(
                  timeout
                );

                setConnected(
                  false
                );

                setRecording(
                  false
                );

                setSpeaking(
                  false
                );

                if (
                  !manualCloseRef.current
                ) {
                  setStatus(
                    "closed"
                  );

                  setConnectionStage(
                    "closed"
                  );

                  const closeMessage =
                    closeEvent.reason ||
                    (
                      closeEvent.code !==
                      1000
                        ? `Realtime connection closed with code ${closeEvent.code}.`
                        : ""
                    );

                  if (
                    closeMessage
                  ) {
                    setError(
                      closeMessage
                    );
                  }
                }

                if (
                  !settled
                ) {
                  settled =
                    true;

                  reject(
                    new Error(
                      closeEvent.reason ||
                        "Realtime connection closed before initialization."
                    )
                  );
                }
              };
          }
        );

        return {
          ...result,

          session:
            normalized,
        };
      },
      [
        disconnect,
        handleMessage,
        send,
      ]
    );

  /* =======================================================
     SEND TEXT
  ======================================================= */

  const sendText =
    useCallback(
      (
        text
      ) => {
        const normalized =
          String(
            text || ""
          ).trim();

        if (
          !normalized ||
          !connected ||
          connectionStage !==
            "ready"
        ) {
          return false;
        }

        const sent =
          send({
            event:
              "conversation:text",

            text:
              normalized,

            message:
              normalized,
          });

        if (sent) {
          lastTypedMessageRef.current =
            normalized;

          appendMessage(
            "user",
            normalized
          );
        }

        return sent;
      },
      [
        appendMessage,
        connected,
        connectionStage,
        send,
      ]
    );

  /* =======================================================
     INTERRUPT
  ======================================================= */

  const interrupt =
    useCallback(
      () => {
        clearPlayback();

        assistantTranscriptRef.current =
          "";

        setAssistantTranscript(
          ""
        );

        send({
          event:
            "conversation:interrupt",
        });
      },
      [
        clearPlayback,
        send,
      ]
    );

  /* =======================================================
     CLEAR MESSAGES
  ======================================================= */

  const clearMessages =
    useCallback(
      () => {
        setMessages([]);

        userTranscriptRef.current =
          "";

        assistantTranscriptRef.current =
          "";

        lastTypedMessageRef.current =
          "";

        setUserTranscript(
          ""
        );

        setAssistantTranscript(
          ""
        );
      },
      []
    );

  /* =======================================================
     KEEPALIVE PING
  ======================================================= */

  useEffect(
    () => {
      if (!connected) {
        return undefined;
      }

      const timer =
        window.setInterval(
          () => {
            send({
              event:
                "ping",

              timestamp:
                Date.now(),
            });
          },
          20000
        );

      return () =>
        window.clearInterval(
          timer
        );
    },
    [
      connected,
      send,
    ]
  );


    /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(
    () => {
      mountedRef.current =
        true;

      return () => {
        mountedRef.current =
          false;

        manualCloseRef.current =
          true;

        try {
          socketRef.current
            ?.close(
              1000,
              "Component unmounted"
            );
        } catch {
          // Ignore close error.
        }

        streamRef.current
          ?.getTracks()
          .forEach(
            (
              track
            ) => {
              track.stop();
            }
          );

        if (
          inputContextRef.current &&
          inputContextRef.current
            .state !== "closed"
        ) {
          inputContextRef.current
            .close()
            .catch(
              () => {}
            );
        }

        if (
          outputContextRef.current &&
          outputContextRef.current
            .state !== "closed"
        ) {
          outputContextRef.current
            .close()
            .catch(
              () => {}
            );
        }

        socketRef.current =
          null;

        streamRef.current =
          null;

        inputContextRef.current =
          null;

        outputContextRef.current =
          null;

        processorRef.current =
          null;

        sourceRef.current =
          null;

        currentOutputRef.current =
          null;

        outputQueueRef.current =
          [];

        outputPlayingRef.current =
          false;
      };
    },
    []
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    session,

    status,

    connectionStage,

    connected,

    recording,

    speaking,

    permission,

    messages,

    userTranscript,

    assistantTranscript,

    error,

    connect,

    disconnect,

    sendText,

    startMicrophone,

    stopMicrophone,

    interrupt,

    clearMessages,
  };
}