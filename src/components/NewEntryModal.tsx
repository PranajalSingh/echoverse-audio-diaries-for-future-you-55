
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioRecorder } from "./AudioRecorder";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import type { Entry } from "../pages/Index";

interface NewEntryModalProps {
  onClose: () => void;
  onSave: (entry: Omit<Entry, 'id'>) => void;
}

const MOOD_OPTIONS = [
  { emoji: "😄", label: "Excited" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😍", label: "Love" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😴", label: "Tired" },
  { emoji: "✨", label: "Hopeful" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🥳", label: "Celebratory" },
];

export const NewEntryModal = ({ onClose, onSave }: NewEntryModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    
    // Validation
    if (!title.trim()) {
      setError("Please enter a title for your entry.");
      return;
    }
    
    if (!selectedMood) {
      setError("Please select a mood.");
      return;
    }
    
    if (!unlockDate) {
      setError("Please select an unlock date.");
      return;
    }
    
    if (!audioBlob) {
      setError("Please record an audio message.");
      return;
    }
    
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    // Validate unlock date is in the future
    const unlockDateTime = new Date(unlockDate);
    const now = new Date();
    if (unlockDateTime <= now) {
      setError("Unlock date must be in the future.");
      return;
    }

    // File size validation (redundant check)
    if (audioBlob.size > 1024 * 1024) {
      setError("Audio file is too large. Maximum size is 1MB.");
      return;
    }

    const entry: Omit<Entry, 'id'> = {
      title: title.trim(),
      mood: selectedMood,
      recordedDate: new Date().toISOString().split('T')[0],
      unlockDate,
      isUnlocked: false, // Always false for new entries since unlock date is in future
      audioUrl: null,
      audioBlob,
      userId: user.id,
      fileSize: audioBlob.size,
    };

    onSave(entry);
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5); // Max 5 years in future
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Audio Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 px-1">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Entry Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this about?"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
              maxLength={100}
            />
            <div className="text-xs text-purple-300 text-right">
              {title.length}/100
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Mood</Label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <Button
                  key={mood.emoji}
                  variant="ghost"
                  onClick={() => setSelectedMood(mood.emoji)}
                  className={`h-10 sm:h-12 text-lg sm:text-2xl hover:bg-white/10 transition-all duration-200 ${
                    selectedMood === mood.emoji ? 'bg-purple-600 scale-105' : 'bg-white/5'
                  }`}
                  title={mood.label}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-sm text-purple-200 text-center">
                {MOOD_OPTIONS.find(m => m.emoji === selectedMood)?.label}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlockDate">Unlock Date</Label>
            <div className="relative">
              <Input
                id="unlockDate"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                min={today}
                max={maxDateStr}
                className="bg-white/10 border-white/20 text-white"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200 pointer-events-none" />
            </div>
            {unlockDate && (
              <p className="text-xs sm:text-sm text-purple-200">
                You'll meet this voice again on {new Date(unlockDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Record Your Message</Label>
            <AudioRecorder onRecordingComplete={setAudioBlob} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title || !selectedMood || !unlockDate || !audioBlob}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
