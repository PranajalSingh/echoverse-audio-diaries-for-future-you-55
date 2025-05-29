
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, X, Gift } from "lucide-react";
import { useState } from "react";
import type { Entry } from "../pages/Index";

interface NotificationBannerProps {
  entries: Entry[];
  onPlayEntry: (entry: Entry) => void;
}

export const NotificationBanner = ({ entries, onPlayEntry }: NotificationBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || entries.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-green-500/30 p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              🎉 {entries.length === 1 ? 'An entry has' : `${entries.length} entries have`} unlocked!
            </h3>
            <p className="text-green-200 text-sm">
              {entries.length === 1 
                ? "Your past self has a message waiting for you"
                : "Your past selves have messages waiting for you"
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {entries.slice(0, 3).map((entry) => (
            <Button
              key={entry.id}
              onClick={() => onPlayEntry(entry)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Play className="w-3 h-3" />
              <span className="text-lg">{entry.mood}</span>
              {entry.title.length > 15 ? `${entry.title.slice(0, 15)}...` : entry.title}
            </Button>
          ))}
          
          {entries.length > 3 && (
            <span className="text-green-200 text-sm">
              +{entries.length - 3} more
            </span>
          )}
          
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="text-green-200 hover:bg-green-800/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
