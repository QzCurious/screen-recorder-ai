import React from 'react';
import { Video, Pause, Square, Mic, MicOff, Settings } from 'lucide-react';
import type { VideoFormat, VideoQuality } from '../hooks/useScreenRecorder';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isMicEnabled: boolean;
  videoFormat: VideoFormat;
  videoQuality: VideoQuality;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
  onToggleMic: () => void;
  onChangeFormat: (format: VideoFormat) => void;
  onChangeQuality: (quality: VideoQuality) => void;
}

export function RecordingControls({
  isRecording,
  isPaused,
  isMicEnabled,
  videoFormat,
  videoQuality,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  onToggleMic,
  onChangeFormat,
  onChangeQuality,
}: RecordingControlsProps) {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-zinc-800/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-zinc-700">
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <>
              <button
                onClick={onStartRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                <Video size={20} />
                <span>Start Recording</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                title="Settings"
              >
                <Settings size={24} className="text-white" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onPauseRecording}
                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                <Pause size={24} className="text-white" />
              </button>
              <button
                onClick={onStopRecording}
                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                title="Stop"
              >
                <Square size={24} className="text-white" />
              </button>
            </>
          )}
          <button
            onClick={onToggleMic}
            className={`p-2 hover:bg-zinc-700 rounded-full transition-colors ${
              !isMicEnabled && 'text-zinc-500'
            }`}
            title={isMicEnabled ? "Disable Microphone" : "Enable Microphone"}
          >
            {isMicEnabled ? (
              <Mic size={24} className="text-white" />
            ) : (
              <MicOff size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {showSettings && !isRecording && (
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-zinc-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-zinc-700 w-72">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Format
              </label>
              <select
                value={videoFormat}
                onChange={(e) => onChangeFormat(e.target.value as VideoFormat)}
                className="w-full bg-zinc-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="webm-vp9">WebM (VP9)</option>
                <option value="webm-vp8">WebM (VP8)</option>
                <option value="mp4">MP4 (H.264)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Quality
              </label>
              <select
                value={videoQuality}
                onChange={(e) => onChangeQuality(e.target.value as VideoQuality)}
                className="w-full bg-zinc-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="high">High (8 Mbps)</option>
                <option value="medium">Medium (5 Mbps)</option>
                <option value="low">Low (2.5 Mbps)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}