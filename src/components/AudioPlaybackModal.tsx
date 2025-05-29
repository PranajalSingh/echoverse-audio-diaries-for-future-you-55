
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import type { Entry } from "../pages/Index";

interface AudioPlaybackModalProps {
  entry: Entry;
  onClose: () => void;
  onSaveReflection: (entryId: string, reflection: string) => void;
}

export const AudioPlaybackModal = ({ entry, onClose, onSaveReflection }: AudioPlaybackModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reflection, setReflection] = useState(entry.reflection || "");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (entry.audioBlob) {
      const audioUrl = URL.createObjectURL(entry.audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      return () => {
        if (audioRef.current) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    }
  }, [entry.audioBlob]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveReflection = () => {
    onSaveReflection(entry.id, reflection);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">{entry.mood}</span>
            {entry.title}
          </DialogTitle>
          <p className="text-purple-200 text-sm">
            Recorded on {formatDate(entry.recordedDate)}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Audio Player */}
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={restart}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={togglePlayback}
                className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(currentTime / duration) * 100}%, #ffffff33 ${(currentTime / duration) * 100}%, #ffffff33 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-purple-200">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Reflection Section */}
          <div className="space-y-3">
            <Label htmlFor="reflection" className="text-white">
              Your reflection on this entry
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How do you feel listening to your past self? What insights do you have now?"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Button
              onClick={handleSaveReflection}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Save Reflection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
