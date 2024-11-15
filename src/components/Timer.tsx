import React, { useEffect, useState } from 'react';

interface TimerProps {
  isRecording: boolean;
  isPaused: boolean;
}

export function Timer({ isRecording, isPaused }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${hours > 0 ? `${pad(hours)}:` : ''}${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-zinc-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-zinc-700">
        <span className="text-white font-mono text-xl">
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
}