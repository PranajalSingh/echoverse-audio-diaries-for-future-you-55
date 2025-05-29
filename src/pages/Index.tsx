import { useState, useEffect } from "react";
import { AudioRecorder } from "../components/AudioRecorder";
import { TimelineView } from "../components/TimelineView";
import { Header } from "../components/Header";
import { NewEntryModal } from "../components/NewEntryModal";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { AudioPlaybackModal } from "../components/AudioPlaybackModal";
import { NotificationBanner } from "../components/NotificationBanner";
import { SettingsModal } from "../components/SettingsModal";

export interface Entry {
  id: string;
  title: string;
  mood: string;
  recordedDate: string;
  unlockDate: string;
  isUnlocked: boolean;
  audioUrl: string | null;
  audioBlob?: Blob;
  reflection?: string;
}

const Index = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playingEntry, setPlayingEntry] = useState<Entry | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeCapsuleMode, setTimeCapsuleMode] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: "1",
      title: "First Day of College",
      mood: "😄",
      recordedDate: "2024-01-15",
      unlockDate: "2025-01-15",
      isUnlocked: false,
      audioUrl: null,
    },
    {
      id: "2", 
      title: "Summer Reflections",
      mood: "😌",
      recordedDate: "2024-06-20",
      unlockDate: "2024-12-20",
      isUnlocked: true,
      audioUrl: "/placeholder-audio.mp3",
    },
    {
      id: "3",
      title: "New Year Hopes",
      mood: "✨",
      recordedDate: "2024-12-31",
      unlockDate: "2025-12-31",
      isUnlocked: false,
      audioUrl: null,
    }
  ]);

  const currentUser = {
    name: "John Doe",
    email: "john@example.com"
  };

  // Check for newly unlocked entries on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const now = new Date();
      const storedLastVisit = localStorage.getItem('lastVisit');
      
      if (storedLastVisit) {
        setLastVisit(storedLastVisit);
      }
      
      // Update unlock status for entries
      setEntries(prevEntries => 
        prevEntries.map(entry => ({
          ...entry,
          isUnlocked: new Date(entry.unlockDate) <= now && !timeCapsuleMode
        }))
      );
      
      // Update last visit timestamp
      localStorage.setItem('lastVisit', now.toISOString());
    }
  }, [isAuthenticated, timeCapsuleMode]);

  // Check for newly unlocked entries
  const getNewlyUnlockedEntries = () => {
    if (!lastVisit) return [];
    
    const lastVisitDate = new Date(lastVisit);
    const now = new Date();
    
    return entries.filter(entry => {
      const unlockDate = new Date(entry.unlockDate);
      return unlockDate > lastVisitDate && unlockDate <= now && entry.isUnlocked;
    });
  };

  const handleSaveEntry = (newEntry: Omit<Entry, 'id'>) => {
    const entry: Entry = {
      ...newEntry,
      id: Date.now().toString(),
      isUnlocked: new Date(newEntry.unlockDate) <= new Date() && !timeCapsuleMode
    };
    
    setEntries(prev => [...prev, entry]);
    setShowNewEntry(false);
  };

  const handlePlayEntry = (entry: Entry) => {
    if (entry.isUnlocked) {
      setPlayingEntry(entry);
    }
  };

  const handleSaveReflection = (entryId: string, reflection: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, reflection }
          : entry
      )
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any stored data if needed
    localStorage.removeItem('lastVisit');
  };

  const filteredEntries = timeCapsuleMode 
    ? entries.filter(entry => {
        const oneYearFromCreation = new Date(entry.recordedDate);
        oneYearFromCreation.setFullYear(oneYearFromCreation.getFullYear() + 1);
        return oneYearFromCreation <= new Date();
      })
    : entries;

  if (!isAuthenticated) {
    return <WelcomeScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const newlyUnlockedEntries = getNewlyUnlockedEntries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Header 
          onNewEntry={() => setShowNewEntry(true)}
          onSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        
        {newlyUnlockedEntries.length > 0 && (
          <NotificationBanner 
            entries={newlyUnlockedEntries}
            onPlayEntry={handlePlayEntry}
          />
        )}
        
        <main className="mt-8">
          <TimelineView 
            entries={filteredEntries}
            onPlayEntry={handlePlayEntry}
            timeCapsuleMode={timeCapsuleMode}
          />
        </main>

        {showNewEntry && (
          <NewEntryModal 
            onClose={() => setShowNewEntry(false)}
            onSave={handleSaveEntry}
          />
        )}

        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            timeCapsuleMode={timeCapsuleMode}
            onTimeCapsuleModeChange={setTimeCapsuleMode}
          />
        )}

        {playingEntry && (
          <AudioPlaybackModal
            entry={playingEntry}
            onClose={() => setPlayingEntry(null)}
            onSaveReflection={handleSaveReflection}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
