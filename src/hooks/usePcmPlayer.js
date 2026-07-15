import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const base64ToArrayBuffer = (
  base64
) => {
  const binary =
    window.atob(base64);

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

  return bytes.buffer;
};

const pcm16ToFloat32 = (
  arrayBuffer
) => {
  const pcm =
    new Int16Array(
      arrayBuffer
    );

  const output =
    new Float32Array(
      pcm.length
    );

  for (
    let index = 0;
    index < pcm.length;
    index += 1
  ) {
    output[index] =
      pcm[index] / 32768;
  }

  return output;
};

export default function usePcmPlayer({
  defaultSampleRate = 24000,
  onSpeakingChange,
} = {}) {
  const [
    speaking,
    setSpeaking,
  ] = useState(false);

  const audioContextRef =
    useRef(null);

  const nextStartTimeRef =
    useRef(0);

  const activeSourcesRef =
    useRef(new Set());

  const onSpeakingChangeRef =
    useRef(
      onSpeakingChange
    );

  useEffect(() => {
    onSpeakingChangeRef.current =
      onSpeakingChange;
  }, [onSpeakingChange]);

  const updateSpeaking =
    useCallback(
      (value) => {
        setSpeaking(value);

        if (
          typeof onSpeakingChangeRef
            .current ===
          "function"
        ) {
          onSpeakingChangeRef.current(
            value
          );
        }
      },
      []
    );

  const getAudioContext =
    useCallback(async () => {
      if (
        !audioContextRef.current
      ) {
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

        audioContextRef.current =
          new AudioContextClass();
      }

      if (
        audioContextRef.current
          .state ===
        "suspended"
      ) {
        await audioContextRef.current
          .resume();
      }

      return audioContextRef.current;
    }, []);

  const playChunk =
    useCallback(
      async (
        base64Audio,
        sampleRate =
          defaultSampleRate
      ) => {
        if (!base64Audio) {
          return;
        }

        const audioContext =
          await getAudioContext();

        const pcmBuffer =
          base64ToArrayBuffer(
            base64Audio
          );

        const floatSamples =
          pcm16ToFloat32(
            pcmBuffer
          );

        if (
          !floatSamples.length
        ) {
          return;
        }

        const actualSampleRate =
          Number(sampleRate) ||
          defaultSampleRate;

        const audioBuffer =
          audioContext.createBuffer(
            1,
            floatSamples.length,
            actualSampleRate
          );

        audioBuffer.copyToChannel(
          floatSamples,
          0
        );

        const source =
          audioContext.createBufferSource();

        source.buffer =
          audioBuffer;

        source.connect(
          audioContext.destination
        );

        const startTime =
          Math.max(
            audioContext.currentTime +
              0.02,
            nextStartTimeRef.current
          );

        source.start(
          startTime
        );

        nextStartTimeRef.current =
          startTime +
          audioBuffer.duration;

        activeSourcesRef.current.add(
          source
        );

        updateSpeaking(
          true
        );

        source.onended =
          () => {
            activeSourcesRef.current.delete(
              source
            );

            if (
              activeSourcesRef.current
                .size === 0
            ) {
              nextStartTimeRef.current =
                audioContext.currentTime;

              updateSpeaking(
                false
              );
            }
          };
      },
      [
        defaultSampleRate,
        getAudioContext,
        updateSpeaking,
      ]
    );

  const stopPlayback =
    useCallback(() => {
      activeSourcesRef.current.forEach(
        (source) => {
          try {
            source.stop();
          } catch {
            // Already stopped.
          }

          try {
            source.disconnect();
          } catch {
            // Already disconnected.
          }
        }
      );

      activeSourcesRef.current.clear();

      nextStartTimeRef.current =
        audioContextRef.current
          ?.currentTime ||
        0;

      updateSpeaking(
        false
      );
    }, [updateSpeaking]);

  const closePlayer =
    useCallback(async () => {
      stopPlayback();

      if (
        audioContextRef.current &&
        audioContextRef.current
          .state !==
          "closed"
      ) {
        await audioContextRef.current
          .close();
      }

      audioContextRef.current =
        null;

      nextStartTimeRef.current =
        0;
    }, [stopPlayback]);

  return {
    speaking,
    playChunk,
    stopPlayback,
    closePlayer,
  };
}