import { signal, useSignalEffect } from "@preact/signals-react";

const isSpeakingSignal = signal(false);
function useVoiceDetection(stream: MediaStream | null, threshold: number = 1000): boolean {

  useSignalEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256; // Frequency resolution
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detectVoice = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((acc, val) => acc + val, 0);

      isSpeakingSignal.value = volume > threshold; // Update speaking state
    };

    const interval = setInterval(detectVoice, 100); // Check every 100ms

    return () => {
      analyser.disconnect();
      source.disconnect();
      clearInterval(interval);
      audioContext.close();
    };
  });

  return isSpeakingSignal.value;
}

export default useVoiceDetection;
