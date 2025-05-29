
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Timer, Clock, Calendar } from "lucide-react";
import { useState } from "react";

interface Entry {
  id: string;
  title: string;
  mood: string;
  recordedDate: string;
  unlockDate: string;
  isUnlocked: boolean;
  audioUrl: string | null;
}

interface TimelineViewProps {
  entries: Entry[];
}

export const TimelineView = ({ entries }: TimelineViewProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const getMoodColor = (mood: string) => {
    const colors = {
      excited: "bg-yellow-500",
      nostalgic: "bg-purple-500",
      hopeful: "bg-green-500",
      reflective: "bg-blue-500",
      grateful: "bg-pink-500",
    };
    return colors[mood as keyof typeof colors] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilUnlock = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diffTime = unlock.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Audio Timeline</h2>
        <p className="text-purple-200">
          {entries.filter(e => e.isUnlocked).length} entries unlocked • {entries.filter(e => !e.isUnlocked).length} waiting to be discovered
        </p>
      </div>

      <div className="grid gap-6">
        {entries.map((entry, index) => (
          <Card 
            key={entry.id} 
            className={`relative overflow-hidden transition-all duration-300 ${
              entry.isUnlocked 
                ? "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15" 
                : "bg-white/5 backdrop-blur-sm border-white/10 opacity-75"
            }`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400" />
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{entry.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-purple-200">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Recorded {formatDate(entry.recordedDate)}
                    </div>
                    <Badge className={`${getMoodColor(entry.mood)} text-white text-xs`}>
                      {entry.mood}
                    </Badge>
                  </div>
                </div>
                
                {entry.isUnlocked ? (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    <Timer className="w-3 h-3 mr-1" />
                    {getDaysUntilUnlock(entry.unlockDate)} days
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {entry.isUnlocked ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPlayingId(playingId === entry.id ? null : entry.id)}
                    className="text-white hover:bg-white/10"
                  >
                    {playingId === entry.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 w-1/3 rounded-full" />
                  </div>
                  
                  <span className="text-purple-200 text-sm">2:34</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Will unlock on {formatDate(entry.unlockDate)}
                  </span>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div className="h-full bg-white/10 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
