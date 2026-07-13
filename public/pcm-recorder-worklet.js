class PcmRecorderProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input =
      inputs?.[0];

    const firstChannel =
      input?.[0];

    if (
      !firstChannel ||
      firstChannel.length === 0
    ) {
      return true;
    }

    const copiedSamples =
      new Float32Array(
        firstChannel.length
      );

    copiedSamples.set(
      firstChannel
    );

    this.port.postMessage(
      copiedSamples,
      [
        copiedSamples.buffer,
      ]
    );

    return true;
  }
}

registerProcessor(
  "pcm-recorder-processor",
  PcmRecorderProcessor
);