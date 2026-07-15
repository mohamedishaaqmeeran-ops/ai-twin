import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const TARGET_SAMPLE_RATE = 16000;
const PROCESSOR_BUFFER_SIZE = 4096;

/* =========================================================
   FLOAT32 TO PCM16
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
   ARRAY BUFFER TO BASE64
========================================================= */

const arrayBufferToBase64 = (
  arrayBuffer
) => {
  const bytes =
    new Uint8Array(
      arrayBuffer
    );

  const chunkSize =
    0x8000;

  let binary = "";

  for (
    let offset = 0;
    offset < bytes.length;
    offset += chunkSize
  ) {
    const chunk =
      bytes.subarray(
        offset,
        offset + chunkSize
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
    return new Float32Array(
      inputBuffer
    );
  }

  if (
    outputSampleRate >
    inputSampleRate
  ) {
    throw new Error(
      "Output sample rate cannot exceed input sample rate."
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

  let outputIndex = 0;
  let inputOffset = 0;

  while (
    outputIndex <
    outputBuffer.length
  ) {
    const nextInputOffset =
      Math.round(
        (
          outputIndex +
          1
        ) *
          sampleRateRatio
      );

    let sum = 0;
    let count = 0;

    for (
      let index =
        inputOffset;
      index <
        nextInputOffset &&
      index <
        inputBuffer.length;
      index += 1
    ) {
      sum +=
        inputBuffer[index];

      count += 1;
    }

    outputBuffer[
      outputIndex
    ] =
      count > 0
        ? sum / count
        : 0;

    outputIndex += 1;
    inputOffset =
      nextInputOffset;
  }

  return outputBuffer;
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
  ] = useState("prompt");

  const mediaStreamRef =
    useRef(null);

  const audioContextRef =
    useRef(null);

  const sourceNodeRef =
    useRef(null);

  const processorNodeRef =
    useRef(null);

  const silentGainNodeRef =
    useRef(null);

  const recordingRef =
    useRef(false);

  const onAudioChunkRef =
    useRef(onAudioChunk);

  const onErrorRef =
    useRef(onError);

  useEffect(() => {
    onAudioChunkRef.current =
      onAudioChunk;
  }, [onAudioChunk]);

  useEffect(() => {
    onErrorRef.current =
      onError;
  }, [onError]);

  /* =======================================================
     MICROPHONE PERMISSION
  ======================================================= */

  useEffect(() => {
    let permissionStatus =
      null;

    const checkPermission =
      async () => {
        try {
          if (
            !navigator.permissions
              ?.query
          ) {
            return;
          }

          permissionStatus =
            await navigator.permissions
              .query({
                name:
                  "microphone",
              });

          setPermission(
            permissionStatus.state
          );

          permissionStatus.onchange =
            () => {
              setPermission(
                permissionStatus
                  .state
              );
            };
        } catch {
          // Permission API may not
          // support microphone queries.
        }
      };

    checkPermission();

    return () => {
      if (
        permissionStatus
      ) {
        permissionStatus.onchange =
          null;
      }
    };
  }, []);

  /* =======================================================
     CLEANUP
  ======================================================= */

  const cleanup =
    useCallback(async () => {
      recordingRef.current =
        false;

      setRecording(false);

      if (
        processorNodeRef.current
      ) {
        processorNodeRef.current
          .onaudioprocess =
          null;

        try {
          processorNodeRef.current
            .disconnect();
        } catch {
          // Already disconnected.
        }

        processorNodeRef.current =
          null;
      }

      if (
        sourceNodeRef.current
      ) {
        try {
          sourceNodeRef.current
            .disconnect();
        } catch {
          // Already disconnected.
        }

        sourceNodeRef.current =
          null;
      }

      if (
        silentGainNodeRef.current
      ) {
        try {
          silentGainNodeRef.current
            .disconnect();
        } catch {
          // Already disconnected.
        }

        silentGainNodeRef.current =
          null;
      }

      if (
        mediaStreamRef.current
      ) {
        mediaStreamRef.current
          .getTracks()
          .forEach(
            (track) => {
              track.stop();
            }
          );

        mediaStreamRef.current =
          null;
      }

      if (
        audioContextRef.current &&
        audioContextRef.current
          .state !== "closed"
      ) {
        try {
          await audioContextRef.current
            .close();
        } catch {
          // Ignore AudioContext
          // cleanup errors.
        }
      }

      audioContextRef.current =
        null;
    }, []);

  /* =======================================================
     START
  ======================================================= */

  const start =
    useCallback(async () => {
      if (
        recordingRef.current
      ) {
        return;
      }

      try {
        if (
          typeof onAudioChunkRef
            .current !==
          "function"
        ) {
          throw new Error(
            "Microphone audio callback is not configured."
          );
        }

        if (
          !navigator.mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            "Microphone access is not supported in this browser."
          );
        }

        const stream =
          await navigator
            .mediaDevices
            .getUserMedia({
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
            });

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

        if (
          audioContext.state ===
          "suspended"
        ) {
          await audioContext.resume();
        }

        const sourceNode =
          audioContext
            .createMediaStreamSource(
              stream
            );

        sourceNodeRef.current =
          sourceNode;

        if (
          typeof audioContext
            .createScriptProcessor !==
          "function"
        ) {
          throw new Error(
            "PCM microphone processing is not supported in this browser."
          );
        }

        const processorNode =
          audioContext
            .createScriptProcessor(
              PROCESSOR_BUFFER_SIZE,
              1,
              1
            );

        processorNodeRef.current =
          processorNode;

        const silentGainNode =
          audioContext
            .createGain();

        silentGainNode.gain.value =
          0;

        silentGainNodeRef.current =
          silentGainNode;

        processorNode
          .onaudioprocess =
          (event) => {
            if (
              !recordingRef.current
            ) {
              return;
            }

            try {
              const inputSamples =
                event.inputBuffer
                  .getChannelData(
                    0
                  );

              const downsampledSamples =
                downsampleBuffer(
                  inputSamples,
                  audioContext
                    .sampleRate,
                  TARGET_SAMPLE_RATE
                );

              const pcm16Samples =
                float32ToPcm16(
                  downsampledSamples
                );

              if (
                pcm16Samples.length ===
                0
              ) {
                return;
              }

              const base64 =
                arrayBufferToBase64(
                  pcm16Samples.buffer
                );

              const callback =
                onAudioChunkRef.current;

              if (
                typeof callback !==
                "function"
              ) {
                throw new Error(
                  "Microphone audio callback became unavailable."
                );
              }

              callback({
                base64,

                sampleRate:
                  TARGET_SAMPLE_RATE,

                mimeType:
                  `audio/pcm;rate=${TARGET_SAMPLE_RATE}`,
              });
            } catch (
              processingError
            ) {
              console.error(
                "MICROPHONE PCM PROCESSING ERROR:",
                processingError
              );

              if (
                typeof onErrorRef
                  .current ===
                "function"
              ) {
                onErrorRef.current(
                  processingError
                );
              }
            }
          };

        sourceNode.connect(
          processorNode
        );

        processorNode.connect(
          silentGainNode
        );

        silentGainNode.connect(
          audioContext.destination
        );

        recordingRef.current =
          true;

        setRecording(true);

        console.log(
          "MICROPHONE PCM STARTED:",
          {
            inputSampleRate:
              audioContext
                .sampleRate,

            outputSampleRate:
              TARGET_SAMPLE_RATE,

            processorBufferSize:
              PROCESSOR_BUFFER_SIZE,
          }
        );
      } catch (error) {
        console.error(
          "MICROPHONE START ERROR:",
          error
        );

        if (
          error?.name ===
          "NotAllowedError" ||
          error?.name ===
          "PermissionDeniedError"
        ) {
          setPermission(
            "denied"
          );
        }

        await cleanup();

        if (
          typeof onErrorRef
            .current ===
          "function"
        ) {
          onErrorRef.current(
            error
          );
        }

        throw error;
      }
    }, [cleanup]);

  /* =======================================================
     STOP
  ======================================================= */

  const stop =
    useCallback(async () => {
      if (
        !recordingRef.current &&
        !mediaStreamRef.current
      ) {
        return;
      }

      console.log(
        "MICROPHONE PCM STOPPED"
      );

      await cleanup();
    }, [cleanup]);

  /* =======================================================
     UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      cleanup().catch(() => {});
    };
  }, [cleanup]);

  return {
    recording,
    permission,
    start,
    stop,
  };
}