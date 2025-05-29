
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioRecorder } from "./AudioRecorder";
import { CalendarIcon } from "lucide-react";

interface NewEntryModalProps {
  onClose: () => void;
  onSave: (entry: any) => void;
}

export const NewEntryModal = ({ onClose, onSave }: NewEntryModalProps) => {
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [audioRecorded, setAudioRecorded] = useState(false);

  const handleSave = () => {
    if (!title || !mood || !unlockDate || !audioRecorded) {
      return;
    }

    const entry = {
      title,
      mood,
      recordedDate: new Date().toISOString().split('T')[0],
      unlockDate,
      isUnlocked: false,
      audioUrl: null,
    };

    onSave(entry);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Audio Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Entry Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this about?"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Current Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="excited">Excited</SelectItem>
                <SelectItem value="nostalgic">Nostalgic</SelectItem>
                <SelectItem value="hopeful">Hopeful</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
                <SelectItem value="grateful">Grateful</SelectItem>
              </SelectContent>
            </Select>
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
                className="bg-white/10 border-white/20 text-white"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Record Your Message</Label>
            <AudioRecorder onRecordingComplete={() => setAudioRecorded(true)} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title || !mood || !unlockDate || !audioRecorded}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
