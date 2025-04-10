"use client";
import { useRef, useEffect } from "react";
import cn from "@/lib/utils/cn";

interface IAudioVisualizerProps {
  stream: MediaStream | null;
  radius?: number; // Radius for the circular visualizer
  className?: string;
  color?: string;
  fftSize?: number;
}

function AudioVisualizer({ stream, color = "#fff", radius = 100, className, fftSize = 256 }: IAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Store the interval ID
  const canvasSize = radius * 2 + 50; // Add padding for bars

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = fftSize;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function drawCircularVisualizer() {
      if (!ctx) return;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the central content
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dynamic border radius
      const barWidth = Math.PI / dataArray.length;

      dataArray.forEach((value, index) => {
        const angle = index * barWidth;
        const barHeight = Math.max((value / 255) * 100, 5);
        const xStart = centerX + Math.cos(angle) * radius;
        const yStart = centerY + Math.sin(angle) * radius;
        const xEnd = centerX + Math.cos(angle) * (radius + barHeight);
        const yEnd = centerY + Math.sin(angle) * (radius + barHeight);

        // Draw bars
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      });
    }

    // Start the interval: 5 times per second (200ms)
    intervalId.current = setInterval(drawCircularVisualizer, 50);
    drawCircularVisualizer();

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current); // Clear the interval on cleanup
      }
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [stream, radius, color]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className={cn("absolute top-1/2 left-1/2 z-10 -translate-1/2", className)}
    ></canvas>
  );
}

export default AudioVisualizer;
