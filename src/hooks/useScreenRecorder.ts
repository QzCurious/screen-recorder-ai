import { useState, useCallback, useRef } from 'react';

export type VideoFormat = 'webm-vp9' | 'webm-vp8' | 'mp4';
export type VideoQuality = 'high' | 'medium' | 'low';

interface VideoConfig {
  mimeType: string;
  extension: string;
  videoBitsPerSecond: number;
}

const VIDEO_CONFIGS: Record<VideoFormat, Record<VideoQuality, VideoConfig>> = {
  'webm-vp9': {
    high: { mimeType: 'video/webm;codecs=vp9', extension: 'webm', videoBitsPerSecond: 8000000 },
    medium: { mimeType: 'video/webm;codecs=vp9', extension: 'webm', videoBitsPerSecond: 5000000 },
    low: { mimeType: 'video/webm;codecs=vp9', extension: 'webm', videoBitsPerSecond: 2500000 },
  },
  'webm-vp8': {
    high: { mimeType: 'video/webm;codecs=vp8', extension: 'webm', videoBitsPerSecond: 6000000 },
    medium: { mimeType: 'video/webm;codecs=vp8', extension: 'webm', videoBitsPerSecond: 4000000 },
    low: { mimeType: 'video/webm;codecs=vp8', extension: 'webm', videoBitsPerSecond: 2000000 },
  },
  mp4: {
    high: { mimeType: 'video/mp4', extension: 'mp4', videoBitsPerSecond: 8000000 },
    medium: { mimeType: 'video/mp4', extension: 'mp4', videoBitsPerSecond: 5000000 },
    low: { mimeType: 'video/mp4', extension: 'mp4', videoBitsPerSecond: 2500000 },
  },
};

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('mp4');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('high');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const videoPreview = useRef<HTMLVideoElement | null>(null);
  const previewContainer = useRef<HTMLDivElement | null>(null);

  const getSupportedMimeType = (format: VideoFormat): VideoFormat => {
    const config = VIDEO_CONFIGS[format][videoQuality];
    if (MediaRecorder.isTypeSupported(config.mimeType)) {
      return format;
    }
    // Fallback chain: VP9 -> VP8 -> MP4
    if (format === 'mp4' && MediaRecorder.isTypeSupported(VIDEO_CONFIGS['webm-vp9'][videoQuality].mimeType)) {
      return 'webm-vp9';
    }
    if (MediaRecorder.isTypeSupported(VIDEO_CONFIGS['webm-vp8'][videoQuality].mimeType)) {
      return 'webm-vp8';
    }
    return 'webm-vp8'; // Final fallback
  };

  const startRecording = useCallback(async () => {
    try {
      const audioStream = isMicEnabled
        ? await navigator.mediaDevices.getUserMedia({ audio: true })
        : undefined;

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          frameRate: 60,
        },
        audio: true,
      });

      if (!previewContainer.current) {
        previewContainer.current = document.createElement('div');
        previewContainer.current.className = 'fixed bottom-24 right-8 w-80 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50 backdrop-blur-sm bg-black/20 transition-transform duration-300 hover:scale-105';
        document.body.appendChild(previewContainer.current);

        const label = document.createElement('div');
        label.className = 'absolute top-3 left-4 px-2 py-1 rounded-md bg-red-500 text-xs font-medium text-white flex items-center gap-1';
        label.innerHTML = '<div class="w-2 h-2 rounded-full bg-white animate-pulse"></div> LIVE';
        previewContainer.current.appendChild(label);
      }

      if (!videoPreview.current) {
        videoPreview.current = document.createElement('video');
        videoPreview.current.autoplay = true;
        videoPreview.current.muted = true;
        videoPreview.current.className = 'w-full h-full object-cover rounded-2xl';
        previewContainer.current.appendChild(videoPreview.current);
      }
      videoPreview.current.srcObject = screenStream;

      const combinedStream = new MediaStream();
      screenStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      screenStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
      }

      const supportedFormat = getSupportedMimeType(videoFormat);
      const config = VIDEO_CONFIGS[supportedFormat][videoQuality];

      mediaRecorder.current = new MediaRecorder(combinedStream, {
        mimeType: config.mimeType,
        videoBitsPerSecond: config.videoBitsPerSecond,
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, {
          type: config.mimeType,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screen-recording-${new Date().toISOString()}.${config.extension}`;
        a.click();
        URL.revokeObjectURL(url);
        recordedChunks.current = [];
        
        if (previewContainer.current) {
          previewContainer.current.remove();
          previewContainer.current = null;
          videoPreview.current = null;
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [isMicEnabled, videoFormat, videoQuality]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      if (isPaused) {
        mediaRecorder.current.resume();
      } else {
        mediaRecorder.current.pause();
      }
      setIsPaused(!isPaused);
    }
  }, [isRecording, isPaused]);

  const toggleMic = useCallback(() => {
    setIsMicEnabled(!isMicEnabled);
  }, [isMicEnabled]);

  return {
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
  };
}