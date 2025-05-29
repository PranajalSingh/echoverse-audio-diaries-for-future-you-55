
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Timer, Clock, Calendar, Lock } from "lucide-react";
import type { Entry } from "../pages/Index";

interface TimelineViewProps {
  entries: Entry[];
  onPlayEntry: (entry: Entry) => void;
  timeCapsuleMode: boolean;
}

export const TimelineView = ({ entries, onPlayEntry, timeCapsuleMode }: TimelineViewProps) => {
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

  const getTimeUntilUnlock = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diffTime = unlock.getTime() - now.getTime();
    
    if (diffTime <= 0) return "Ready to unlock";
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return "Less than an hour";
    }
  };

  // Group entries by year and month
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.recordedDate);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!groups[yearMonth]) {
      groups[yearMonth] = [];
    }
    groups[yearMonth].push(entry);
    return groups;
  }, {} as Record<string, Entry[]>);

  // Sort groups by date (newest first)
  const sortedGroups = Object.entries(groupedEntries).sort(([a], [b]) => b.localeCompare(a));

  const getGroupTitle = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const unlockedCount = entries.filter(e => e.isUnlocked).length;
  const lockedCount = entries.filter(e => !e.isUnlocked).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Audio Timeline</h2>
        <p className="text-purple-200">
          {unlockedCount} {unlockedCount === 1 ? 'entry' : 'entries'} unlocked • {lockedCount} waiting to be discovered
        </p>
        {timeCapsuleMode && (
          <Badge className="mt-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
            <Timer className="w-3 h-3 mr-1" />
            Time Capsule Mode Active
          </Badge>
        )}
      </div>

      <div className="grid gap-8">
        {sortedGroups.map(([yearMonth, groupEntries]) => (
          <div key={yearMonth} className="space-y-4">
            <h3 className="text-xl font-semibold text-white/80 border-b border-white/10 pb-2">
              {getGroupTitle(yearMonth)}
            </h3>
            
            <div className="grid gap-4">
              {groupEntries
                .sort((a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime())
                .map((entry) => (
                <Card 
                  key={entry.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    entry.isUnlocked 
                      ? "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15" 
                      : "bg-white/5 backdrop-blur-sm border-white/10 opacity-75"
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    entry.isUnlocked 
                      ? "bg-gradient-to-b from-green-400 to-emerald-400"
                      : "bg-gradient-to-b from-orange-400 to-red-400"
                  }`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{entry.mood}</span>
                          <CardTitle className="text-white text-lg">{entry.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-purple-200">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Recorded {formatDate(entry.recordedDate)}
                          </div>
                        </div>
                      </div>
                      
                      {entry.isUnlocked ? (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                          Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          <Lock className="w-3 h-3 mr-1" />
                          {getTimeUntilUnlock(entry.unlockDate)}
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
                          onClick={() => onPlayEntry(entry)}
                          className="text-white hover:bg-white/10"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-400 w-full rounded-full" />
                        </div>
                        
                        <span className="text-purple-200 text-sm">Ready to play</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-purple-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          Will unlock on {formatDate(entry.unlockDate)}
                        </span>
                        <div className="flex-1 bg-white/5 rounded-full h-2">
                          <div 
                            className="h-full bg-orange-400/30 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.max(10, Math.min(90, 
                                ((new Date().getTime() - new Date(entry.recordedDate).getTime()) / 
                                (new Date(entry.unlockDate).getTime() - new Date(entry.recordedDate).getTime())) * 100
                              ))}%` 
                            }} 
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
            <p className="text-purple-200">Start creating your audio timeline by recording your first entry</p>
          </div>
        )}
      </div>
    </div>
  );
};
