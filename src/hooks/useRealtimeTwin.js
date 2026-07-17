import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL, apiRequest, toWebSocketUrl } from "../lib/api";

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const CHUNK_SIZE = 4096;

function getEvent(message) {
  return message?.event || message?.type || "";
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const size = 0x8000;

  for (let index = 0; index < bytes.length; index += size) {
    binary += String.fromCharCode(...bytes.subarray(index, index + size));
  }

  return btoa(binary);
}

function base64ToInt16(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Int16Array(bytes.buffer);
}

function float32ToInt16(input) {
  const output = new Int16Array(input.length);

  for (let index = 0; index < input.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, input[index]));
    output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return output;
}

function downsample(input, inputRate, outputRate) {
  if (inputRate === outputRate) return input;
  if (outputRate > inputRate) {
    throw new Error("Output sample rate must not exceed input sample rate.");
  }

  const ratio = inputRate / outputRate;
  const length = Math.round(input.length / ratio);
  const output = new Float32Array(length);

  let inputOffset = 0;

  for (let outputOffset = 0; outputOffset < length; outputOffset += 1) {
    const nextOffset = Math.round((outputOffset + 1) * ratio);
    let total = 0;
    let count = 0;

    while (inputOffset < nextOffset && inputOffset < input.length) {
      total += input[inputOffset];
      count += 1;
      inputOffset += 1;
    }

    output[outputOffset] = count ? total / count : 0;
  }

  return output;
}

function createId() {
  return crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function useRealtimeTwin() {
  const socketRef = useRef(null);
  const sessionRef = useRef(null);
  const streamRef = useRef(null);
  const inputContextRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);
  const outputContextRef = useRef(null);
  const outputQueueRef = useRef([]);
  const outputPlayingRef = useRef(false);
  const currentOutputRef = useRef(null);
  const manualCloseRef = useRef(false);

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("idle");
  const [connectionStage, setConnectionStage] = useState("idle");
  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [permission, setPermission] = useState("unknown");
  const [messages, setMessages] = useState([]);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");
  const [error, setError] = useState("");

  const send = useCallback((payload) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(payload));
    return true;
  }, []);

  const appendMessage = useCallback((role, text, id) => {
    const normalized = String(text || "").trim();
    if (!normalized) return;

    setMessages((current) => [
      ...current,
      {
        id: id || createId(),
        role,
        text: normalized,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const getOutputContext = useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("Audio playback is unsupported in this browser.");
    }

    if (!outputContextRef.current || outputContextRef.current.state === "closed") {
      outputContextRef.current = new AudioContextClass({
        sampleRate: OUTPUT_SAMPLE_RATE,
      });
    }

    if (outputContextRef.current.state === "suspended") {
      await outputContextRef.current.resume();
    }

    return outputContextRef.current;
  }, []);

  const playNext = useCallback(async () => {
    if (outputPlayingRef.current) return;

    const next = outputQueueRef.current.shift();

    if (!next) {
      setSpeaking(false);
      return;
    }

    outputPlayingRef.current = true;
    setSpeaking(true);

    try {
      const context = await getOutputContext();
      const pcm = base64ToInt16(next.audio);
      const floats = new Float32Array(pcm.length);

      for (let index = 0; index < pcm.length; index += 1) {
        floats[index] = pcm[index] / 32768;
      }

      const buffer = context.createBuffer(
        1,
        floats.length,
        Number(next.sampleRate || OUTPUT_SAMPLE_RATE)
      );

      buffer.getChannelData(0).set(floats);

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      currentOutputRef.current = source;

      source.onended = () => {
        currentOutputRef.current = null;
        outputPlayingRef.current = false;
        playNext();
      };

      source.start();
    } catch (playbackError) {
      outputPlayingRef.current = false;
      setError(playbackError.message || "Unable to play realtime audio.");
      playNext();
    }
  }, [getOutputContext]);

  const enqueueAudio = useCallback(
    (audio, sampleRate) => {
      if (!audio) return;

      outputQueueRef.current.push({
        audio,
        sampleRate: sampleRate || OUTPUT_SAMPLE_RATE,
      });

      playNext();
    },
    [playNext]
  );

  const clearPlayback = useCallback(() => {
    outputQueueRef.current = [];

    try {
      currentOutputRef.current?.stop();
    } catch {
      // Already stopped.
    }

    currentOutputRef.current = null;
    outputPlayingRef.current = false;
    setSpeaking(false);
  }, []);

  const stopMicrophone = useCallback(async () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (inputContextRef.current?.state !== "closed") {
      await inputContextRef.current?.close().catch(() => {});
    }

    inputContextRef.current = null;
    setRecording(false);
    send({ event: "audio:end" });
  }, [send]);

  const startMicrophone = useCallback(async () => {
    if (!connected || connectionStage !== "ready") {
      throw new Error("Gemini Live is not ready.");
    }

    if (recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setPermission("granted");
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();

      inputContextRef.current = context;

      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(CHUNK_SIZE, 1, 1);

      sourceRef.current = source;
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const reduced = downsample(input, context.sampleRate, INPUT_SAMPLE_RATE);
        const pcm = float32ToInt16(reduced);
        const audio = arrayBufferToBase64(pcm.buffer);

        send({
          event: "audio:input",
          audio,
          data: audio,
          mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
          sampleRate: INPUT_SAMPLE_RATE,
        });
      };

      source.connect(processor);
      processor.connect(context.destination);

      send({
        event: "audio:start",
        mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
        sampleRate: INPUT_SAMPLE_RATE,
      });

      setRecording(true);
    } catch (microphoneError) {
      setPermission(
        microphoneError?.name === "NotAllowedError" ? "denied" : "error"
      );
      await stopMicrophone();
      throw microphoneError;
    }
  }, [connected, connectionStage, recording, send, stopMicrophone]);

  const handleMessage = useCallback(
    (event) => {
      let message;

      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      const type = getEvent(message);

      if (type === "socket:connected") {
        setConnected(true);
        setStatus("connected");
        setConnectionStage("initializing-gemini");
        return;
      }

      if (type === "session:ready") {
        setConnected(true);
        setStatus("ready");
        setConnectionStage("ready");
        setError("");
        return;
      }

      if (type === "transcript:user") {
        const text = message.text || message.transcript || message.data?.text || "";
        setUserTranscript(text);

        if (message.final || message.isFinal || message.data?.final) {
          appendMessage("user", text);
          setUserTranscript("");
        }

        return;
      }

      if (type === "transcript:assistant") {
        const text = message.text || message.transcript || message.data?.text || "";
        setAssistantTranscript(text);

        if (message.final || message.isFinal || message.data?.final) {
          appendMessage("assistant", text);
          setAssistantTranscript("");
        }

        return;
      }

      if (type === "audio:output") {
        enqueueAudio(
          message.audio || message.base64 || message.data?.audio || message.data,
          message.sampleRate || message.data?.sampleRate
        );
        return;
      }

      if (type === "conversation:turn-complete") {
        if (userTranscript.trim()) appendMessage("user", userTranscript);
        if (assistantTranscript.trim()) appendMessage("assistant", assistantTranscript);
        setUserTranscript("");
        setAssistantTranscript("");
        return;
      }

      if (type === "conversation:interrupted") {
        clearPlayback();
        setAssistantTranscript("");
        return;
      }

      if (type === "session:error") {
        setError(
          message.message ||
          message.error ||
          message.data?.message ||
          "Realtime session error."
        );
        setStatus("error");
        return;
      }

      if (type === "gemini:closed") {
        setConnected(false);
        setConnectionStage("closed");
        setStatus("closed");
        setRecording(false);
        setSpeaking(false);
      }
    },
    [
      appendMessage,
      assistantTranscript,
      clearPlayback,
      enqueueAudio,
      userTranscript,
    ]
  );

  const disconnect = useCallback(async () => {
    manualCloseRef.current = true;
    await stopMicrophone();
    clearPlayback();

    const socket = socketRef.current;

    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      try {
        socket.close(1000, "Client disconnected");
      } catch {
        // Ignore close errors.
      }
    }

    socketRef.current = null;

    const sessionId = sessionRef.current?._id;

    if (sessionId) {
      await fetch(`${API_URL}/api/realtime/sessions/${sessionId}/end`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }

    sessionRef.current = null;
    setSession(null);
    setConnected(false);
    setRecording(false);
    setSpeaking(false);
    setStatus("idle");
    setConnectionStage("idle");
    setUserTranscript("");
    setAssistantTranscript("");
  }, [clearPlayback, stopMicrophone]);

  const connect = useCallback(
    async ({ twinId, productId, language = "English", mode = "test" }) => {
      if (!twinId) throw new Error("Twin ID is required.");
      if (!productId) throw new Error("Product ID is required.");

      await disconnect();
      manualCloseRef.current = false;
      setMessages([]);
      setError("");
      setStatus("creating");
      setConnectionStage("creating-session");

      const result = await apiRequest("/api/realtime/sessions", {
        method: "POST",
        body: JSON.stringify({ twinId, productId, language, mode }),
      });

      const returnedSession =
        result.session || result.data?.session || result.data || {};

      const sessionId =
        returnedSession._id ||
        returnedSession.id ||
        result.sessionId ||
        result.data?.sessionId;

      if (!sessionId) {
        throw new Error("Realtime session ID was not returned.");
      }

      const normalized = {
        ...returnedSession,
        _id: sessionId,
        twinId,
        productId,
        language,
        mode,
      };

      sessionRef.current = normalized;
      setSession(normalized);
      setConnectionStage("connecting-socket");

      const socketUrl =
        result.socketUrl ||
        result.data?.socketUrl ||
        returnedSession.socketUrl ||
        `${toWebSocketUrl(API_URL)}/api/realtime/socket`;

      const socketToken =
        result.socketToken ||
        result.data?.socketToken ||
        returnedSession.socketToken;

      const url = new URL(socketUrl);
      url.searchParams.set("sessionId", sessionId);

      if (socketToken) {
        url.searchParams.set("token", socketToken);
      }

      const socket = new WebSocket(url.toString());
      socketRef.current = socket;

      await new Promise((resolve, reject) => {
        const timeout = window.setTimeout(
          () => reject(new Error("Realtime socket connection timed out.")),
          20000
        );

        socket.onopen = () => {
          window.clearTimeout(timeout);
          setConnected(true);
          setStatus("connected");
          setConnectionStage("initializing-gemini");

          send({
            event: "session:initialize",
            sessionId,
            twinId,
            productId,
            language,
            mode,
          });

          resolve();
        };

        socket.onmessage = handleMessage;

        socket.onerror = () => {
          window.clearTimeout(timeout);
          reject(new Error("Realtime socket connection failed."));
        };

        socket.onclose = (closeEvent) => {
          window.clearTimeout(timeout);
          setConnected(false);
          setRecording(false);
          setSpeaking(false);

          if (!manualCloseRef.current) {
            setStatus("closed");
            setConnectionStage("closed");

            if (closeEvent.code !== 1000) {
              setError(closeEvent.reason || "Realtime connection closed.");
            }
          }
        };
      });

      return {
        ...result,
        session: normalized,
      };
    },
    [disconnect, handleMessage, send]
  );

  const sendText = useCallback(
    (text) => {
      const normalized = String(text || "").trim();

      if (!normalized || !connected || connectionStage !== "ready") {
        return false;
      }

      const sent = send({
        event: "conversation:text",
        text: normalized,
        message: normalized,
      });

      if (sent) appendMessage("user", normalized);
      return sent;
    },
    [appendMessage, connected, connectionStage, send]
  );

  const interrupt = useCallback(() => {
    clearPlayback();
    send({ event: "conversation:interrupt" });
  }, [clearPlayback, send]);

  useEffect(() => {
    if (!connected) return undefined;

    const timer = window.setInterval(() => {
      send({ event: "ping", timestamp: Date.now() });
    }, 20000);

    return () => window.clearInterval(timer);
  }, [connected, send]);

  useEffect(() => {
    return () => {
      manualCloseRef.current = true;
      socketRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      inputContextRef.current?.close().catch(() => {});
      outputContextRef.current?.close().catch(() => {});
    };
  }, []);

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
    clearMessages: () => setMessages([]),
  };
}
