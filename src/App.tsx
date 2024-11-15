import React from 'react';
import { RecordingControls } from './components/RecordingControls';
import { Timer } from './components/Timer';
import { useScreenRecorder } from './hooks/useScreenRecorder';

function App() {
  const {
    isRecording,
    isPaused,
    isMicEnabled,
    videoFormat,
    videoQuality,
    startRecording,
    stopRecording,
    pauseRecording,
    toggleMic,
    setVideoFormat,
    setVideoQuality,
  } = useScreenRecorder();

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {isRecording && <Timer isRecording={isRecording} isPaused={isPaused} />}
      
      <div className="container mx-auto px-4 py-8">
        {!isRecording && (
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Screen Recorder Pro</h1>
            <p className="text-zinc-400 mb-8">
              Record your screen with professional quality. Supports multiple formats and quality settings.
            </p>
          </div>
        )}
      </div>

      <RecordingControls
        isRecording={isRecording}
        isPaused={isPaused}
        isMicEnabled={isMicEnabled}
        videoFormat={videoFormat}
        videoQuality={videoQuality}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onPauseRecording={pauseRecording}
        onToggleMic={toggleMic}
        onChangeFormat={setVideoFormat}
        onChangeQuality={setVideoQuality}
      />
    </div>
  );
}

export default App;