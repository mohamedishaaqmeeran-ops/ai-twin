import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/* =========================================================
   CONFIG
========================================================= */

const TARGET_SAMPLE_RATE =
  16000;

const PROCESSOR_BUFFER_SIZE =
  4096;

/* =========================================================
   HELPERS
========================================================= */

const float32ToPcm16 = (
  floatSamples
) => {
  const pcm =
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

    pcm[index] =
      sample < 0
        ? sample * 32768
        : sample * 32767;
  }

  return pcm;
};

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

const downsampleBuffer = (
  input,
  inputSampleRate,
  outputSampleRate
) => {
  if (
    outputSampleRate ===
    inputSampleRate
  ) {
    return input;
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
      input.length /
      sampleRateRatio
    );

  const output =
    new Float32Array(
      outputLength
    );

  let outputIndex = 0;
  let inputOffset = 0;

  while (
    outputIndex <
    output.length
  ) {
    const nextInputOffset =
      Math.round(
        (
          outputIndex +
          1
        ) *
          sampleRateRatio
      );

    let accumulatedValue =
      0;

    let accumulatedCount =
      0;

    for (
      let index =
        inputOffset;
      index <
      nextInputOffset &&
      index <
      input.length;
      index += 1
    ) {
      accumulatedValue +=
        input[index];

      accumulatedCount += 1;
    }

    output[
      outputIndex
    ] =
      accumulatedCount > 0
        ? accumulatedValue /
          accumulatedCount
        : 0;

    outputIndex += 1;

    inputOffset =
      nextInputOffset;
  }

  return output;
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

  /* =======================================================
     KEEP CALLBACKS CURRENT
  ======================================================= */

  useEffect(() => {
    onAudioChunkRef.current =
      onAudioChunk;
  }, [onAudioChunk]);

  useEffect(() => {
    onErrorRef.current =
      onError;
  }, [onError]);

  /* =======================================================
     CHECK PERMISSION
  ======================================================= */

  useEffect(() => {
    let permissionStatus =
      null;

    const checkPermission =
      async () => {
        try {
          if (
            !navigator
              .permissions
              ?.query
          ) {
            return;
          }

          permissionStatus =
            await navigator
              .permissions
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
          /*
           * Some browsers do not
           * support microphone query.
           */
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
     CLEANUP AUDIO NODES
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
          .disconnect();

        processorNodeRef.current
          .onaudioprocess =
          null;

        processorNodeRef.current =
          null;
      }

      if (
        sourceNodeRef.current
      ) {
        sourceNodeRef.current
          .disconnect();

        sourceNodeRef.current =
          null;
      }

      if (
        silentGainNodeRef.current
      ) {
        silentGainNodeRef.current
          .disconnect();

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
          .state !==
          "closed"
      ) {
        try {
          await audioContextRef.current
            .close();
        } catch {
          // Ignore cleanup error.
        }
      }

      audioContextRef.current =
        null;
    }, []);

  /* =======================================================
     START MICROPHONE
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
          !navigator
            .mediaDevices
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

        setPermission(
          "granted"
        );

        mediaStreamRef.current =
          stream;

        const AudioContextClass =
          window.AudioContext ||
          window.webkitAudioContext;

        if (!AudioContextClass) {
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

        /*
         * ScriptProcessorNode is deprecated,
         * but it remains widely supported
         * and is simple for PCM streaming.
         */
        const processorNode =
          audioContext
            .createScriptProcessor(
              PROCESSOR_BUFFER_SIZE,
              1,
              1
            );

        processorNodeRef.current =
          processorNode;

        /*
         * Silent gain keeps the processor
         * alive without playing microphone
         * audio through speakers.
         */
        const silentGainNode =
          audioContext
            .createGain();

        silentGainNode.gain.value =
          0;

        silentGainNodeRef.current =
          silentGainNode;

        processorNode
          .connect(
            silentGainNode
          );

        silentGainNode
          .connect(
            audioContext.destination
          );

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
                event
                  .inputBuffer
                  .getChannelData(
                    0
                  );

              const downsampled =
                downsampleBuffer(
                  inputSamples,
                  audioContext
                    .sampleRate,
                  TARGET_SAMPLE_RATE
                );

              const pcm16 =
                float32ToPcm16(
                  downsampled
                );

              if (
                pcm16.length ===
                0
              ) {
                return;
              }

              const base64 =
                arrayBufferToBase64(
                  pcm16.buffer
                );

              onAudioChunkRef.current?.(
                {
                  base64,

                  mimeType:
                    `audio/pcm;rate=${TARGET_SAMPLE_RATE}`,

                  sampleRate:
                    TARGET_SAMPLE_RATE,
                }
              );
            } catch (error) {
              console.error(
                "MICROPHONE PCM PROCESSING ERROR:",
                error
              );

              onErrorRef.current?.(
                error
              );
            }
          };

        sourceNode.connect(
          processorNode
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
          }
        );
      } catch (error) {
        console.error(
          "MICROPHONE START ERROR:",
          error
        );

        if (
          error?.name ===
          "NotAllowedError"
        ) {
          setPermission(
            "denied"
          );
        }

        await cleanup();

        onErrorRef.current?.(
          error
        );

        throw error;
      }
    }, [cleanup]);

  /* =======================================================
     STOP MICROPHONE
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
     UNMOUNT CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    recording,
    permission,
    start,
    stop,
  };
}