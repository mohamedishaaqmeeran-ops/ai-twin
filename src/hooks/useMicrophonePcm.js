import {
  useCallback,
  useRef,
  useState,
} from "react";

const TARGET_SAMPLE_RATE =
  16000;

/* =========================================================
   DOWNSAMPLE
========================================================= */

const downsampleBuffer = (
  inputBuffer,
  inputSampleRate,
  outputSampleRate
) => {
  if (
    inputSampleRate ===
    outputSampleRate
  ) {
    return inputBuffer;
  }

  if (
    outputSampleRate >
    inputSampleRate
  ) {
    throw new Error(
      "Output sample rate cannot be greater than input sample rate."
    );
  }

  const sampleRateRatio =
    inputSampleRate /
    outputSampleRate;

  const outputLength =
    Math.round(
      inputBuffer.length /
        sampleRateRatio
    );

  const outputBuffer =
    new Float32Array(
      outputLength
    );

  let outputOffset = 0;
  let inputOffset = 0;

  while (
    outputOffset <
    outputBuffer.length
  ) {
    const nextInputOffset =
      Math.round(
        (outputOffset + 1) *
          sampleRateRatio
      );

    let total = 0;
    let count = 0;

    for (
      let index = inputOffset;
      index <
        nextInputOffset &&
      index <
        inputBuffer.length;
      index += 1
    ) {
      total +=
        inputBuffer[index];

      count += 1;
    }

    outputBuffer[
      outputOffset
    ] =
      count > 0
        ? total / count
        : 0;

    outputOffset += 1;

    inputOffset =
      nextInputOffset;
  }

  return outputBuffer;
};

/* =========================================================
   FLOAT32 → PCM16
========================================================= */

const float32ToPcm16 = (
  floatSamples
) => {
  const pcmSamples =
    new Int16Array(
      floatSamples.length
    );

  for (
    let index = 0;
    index <
    floatSamples.length;
    index += 1
  ) {
    const sample =
      Math.max(
        -1,
        Math.min(
          1,
          floatSamples[index]
        )
      );

    pcmSamples[index] =
      sample < 0
        ? Math.round(
            sample * 32768
          )
        : Math.round(
            sample * 32767
          );
  }

  return pcmSamples;
};

/* =========================================================
   ARRAY BUFFER → BASE64
========================================================= */

const arrayBufferToBase64 = (
  buffer
) => {
  const bytes =
    new Uint8Array(buffer);

  const chunkSize =
    8192;

  let binary = "";

  for (
    let index = 0;
    index < bytes.length;
    index += chunkSize
  ) {
    const chunk =
      bytes.subarray(
        index,
        Math.min(
          index + chunkSize,
          bytes.length
        )
      );

    binary +=
      String.fromCharCode(
        ...chunk
      );
  }

  return window.btoa(
    binary
  );
};

/* =========================================================
   HOOK
========================================================= */

export default function useMicrophonePcm({
  onAudioChunk,
  onError,
} = {}) {
  const [
    recording,
    setRecording,
  ] = useState(false);

  const [
    permission,
    setPermission,
  ] = useState("unknown");

  const mediaStreamRef =
    useRef(null);

  const audioContextRef =
    useRef(null);

  const mediaSourceRef =
    useRef(null);

  const workletNodeRef =
    useRef(null);

  const silentGainRef =
    useRef(null);

  const start =
    useCallback(async () => {
      if (recording) {
        return;
      }

      try {
        if (
          !navigator
            .mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            "Microphone access is not supported in this browser."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: {
                channelCount: 1,

                echoCancellation:
                  true,

                noiseSuppression:
                  true,

                autoGainControl:
                  true,
              },

              video: false,
            }
          );

        mediaStreamRef.current =
          stream;

        setPermission(
          "granted"
        );

        const AudioContextClass =
          window.AudioContext ||
          window.webkitAudioContext;

        if (
          !AudioContextClass
        ) {
          throw new Error(
            "Web Audio API is not supported."
          );
        }

        const audioContext =
          new AudioContextClass();

        audioContextRef.current =
          audioContext;

        await audioContext.audioWorklet.addModule(
          "/pcm-recorder-worklet.js"
        );

        if (
          audioContext.state ===
          "suspended"
        ) {
          await audioContext.resume();
        }

        const source =
          audioContext.createMediaStreamSource(
            stream
          );

        mediaSourceRef.current =
          source;

        const worklet =
          new AudioWorkletNode(
            audioContext,
            "pcm-recorder-processor"
          );

        workletNodeRef.current =
          worklet;

        const silentGain =
          audioContext.createGain();

        silentGain.gain.value =
          0;

        silentGainRef.current =
          silentGain;

        worklet.port.onmessage =
          (event) => {
            try {
              const samples =
                event.data;

              if (
                !samples ||
                samples.length ===
                  0
              ) {
                return;
              }

              const downsampled =
                downsampleBuffer(
                  samples,

                  audioContext.sampleRate,

                  TARGET_SAMPLE_RATE
                );

              const pcm =
                float32ToPcm16(
                  downsampled
                );

              const base64Audio =
                arrayBufferToBase64(
                  pcm.buffer
                );

              onAudioChunk?.({
                base64:
                  base64Audio,

                sampleRate:
                  TARGET_SAMPLE_RATE,

                mimeType:
                  `audio/pcm;rate=${TARGET_SAMPLE_RATE}`,
              });
            } catch (
              processingError
            ) {
              onError?.(
                processingError
              );
            }
          };

        source.connect(
          worklet
        );

        worklet.connect(
          silentGain
        );

        silentGain.connect(
          audioContext.destination
        );

        setRecording(true);
      } catch (error) {
        if (
          error?.name ===
          "NotAllowedError"
        ) {
          setPermission(
            "denied"
          );
        }

        setRecording(false);

        onError?.(error);

        throw error;
      }
    }, [
      recording,
      onAudioChunk,
      onError,
    ]);

  const stop =
    useCallback(async () => {
      try {
        workletNodeRef.current
          ?.disconnect();

        mediaSourceRef.current
          ?.disconnect();

        silentGainRef.current
          ?.disconnect();

        mediaStreamRef.current
          ?.getTracks()
          .forEach(
            (track) => {
              track.stop();
            }
          );

        if (
          audioContextRef.current &&
          audioContextRef.current
            .state !== "closed"
        ) {
          await audioContextRef.current.close();
        }
      } finally {
        mediaStreamRef.current =
          null;

        audioContextRef.current =
          null;

        mediaSourceRef.current =
          null;

        workletNodeRef.current =
          null;

        silentGainRef.current =
          null;

        setRecording(false);
      }
    }, []);

  return {
    recording,
    permission,
    start,
    stop,
  };
}