
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
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Your Audio Timeline</h2>
        <p className="text-purple-200 text-sm sm:text-base px-4">
          {unlockedCount} {unlockedCount === 1 ? 'entry' : 'entries'} unlocked • {lockedCount} waiting to be discovered
        </p>
        {timeCapsuleMode && (
          <Badge className="mt-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
            <Timer className="w-3 h-3 mr-1" />
            Time Capsule Mode Active
          </Badge>
        )}
      </div>

      <div className="grid gap-6 sm:gap-8">
        {sortedGroups.map(([yearMonth, groupEntries]) => (
          <div key={yearMonth} className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white/80 border-b border-white/10 pb-2">
              {getGroupTitle(yearMonth)}
            </h3>
            
            <div className="grid gap-3 sm:gap-4">
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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{entry.mood}</span>
                          <CardTitle className="text-white text-base sm:text-lg truncate">{entry.title}</CardTitle>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-purple-200">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">Recorded {formatDate(entry.recordedDate)}</span>
                          </div>
                          {entry.fileSize && (
                            <div className="text-purple-300">
                              {(entry.fileSize / 1024).toFixed(1)}KB
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {entry.isUnlocked ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">{getTimeUntilUnlock(entry.unlockDate)}</span>
                            <span className="sm:hidden">{getDaysUntilUnlock(entry.unlockDate)}d</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {entry.isUnlocked ? (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPlayEntry(entry)}
                          className="text-white hover:bg-white/10 flex-shrink-0"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-400 w-full rounded-full" />
                        </div>
                        
                        <span className="text-purple-200 text-xs sm:text-sm flex-shrink-0">Ready to play</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-purple-300">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm flex-1 min-w-0">
                          <span className="hidden sm:inline">Will unlock on {formatDate(entry.unlockDate)}</span>
                          <span className="sm:hidden">Unlocks {formatDate(entry.unlockDate)}</span>
                        </span>
                        <div className="flex-1 bg-white/5 rounded-full h-2 max-w-20 sm:max-w-none">
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
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🎤</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No entries yet</h3>
            <p className="text-purple-200 text-sm sm:text-base">Start creating your audio timeline by recording your first entry</p>
          </div>
        )}
      </div>
    </div>
  );
};
