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