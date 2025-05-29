
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_DURATION = 60; // 60 seconds max
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Validate file size
        if (blob.size > MAX_FILE_SIZE) {
          setError(`Recording too large (${(blob.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 1MB.`);
          setHasRecording(false);
          return;
        }
        
        setAudioBlob(blob);
        setHasRecording(true);
        onRecordingComplete(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop at max duration
          if (newTime >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioBlob) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (recordingTime >= MAX_DURATION * 0.9) return "text-red-400";
    if (recordingTime >= MAX_DURATION * 0.7) return "text-yellow-400";
    return "text-white";
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-4">
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-center">
        {!isRecording && !hasRecording && (
          <Button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <Mic className="w-6 h-6 text-white" />
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center animate-pulse"
          >
            <Square className="w-6 h-6 text-white" />
          </Button>
        )}
        
        {hasRecording && !isRecording && (
          <Button
            onClick={togglePlayback}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </Button>
        )}
      </div>
      
      <div className="text-center">
        {isRecording && (
          <div className="space-y-2">
            <div className="text-red-400 text-sm font-medium">Recording...</div>
            <div className={`text-lg font-mono ${getTimeColor()}`}>
              {formatTime(recordingTime)} / {formatTime(MAX_DURATION)}
            </div>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-red-400 rounded-full animate-pulse`}
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
            {recordingTime >= MAX_DURATION * 0.8 && (
              <div className="text-yellow-400 text-xs">
                {Math.ceil(MAX_DURATION - recordingTime)}s remaining
              </div>
            )}
          </div>
        )}
        
        {hasRecording && !isRecording && (
          <div className="space-y-2">
            <div className="text-green-400 text-sm font-medium">Recording Ready</div>
            <div className="text-white text-lg font-mono">{formatTime(recordingTime)}</div>
            <div className="text-purple-200 text-xs">
              Size: {audioBlob ? (audioBlob.size / 1024).toFixed(1) : 0}KB
            </div>
            {isPlaying && (
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-purple-400 rounded-full animate-pulse`}
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {!isRecording && !hasRecording && (
          <div className="space-y-1">
            <div className="text-purple-200 text-sm">Tap to start recording</div>
            <div className="text-purple-300 text-xs">Max {MAX_DURATION}s / 1MB</div>
          </div>
        )}
      </div>
    </div>
  );
};
