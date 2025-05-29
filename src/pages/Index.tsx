
import { useState, useEffect } from "react";
import { AudioRecorder } from "../components/AudioRecorder";
import { TimelineView } from "../components/TimelineView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { NewEntryModal } from "../components/NewEntryModal";
import { AudioPlaybackModal } from "../components/AudioPlaybackModal";
import { NotificationBanner } from "../components/NotificationBanner";
import { SettingsModal } from "../components/SettingsModal";
import { useAuth } from "../contexts/AuthContext";
import { UserDataManager } from "../utils/userDataManager";

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
  userId: string; // Add userId to ensure privacy
}

const Index = () => {
  const { user, logout } = useAuth();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playingEntry, setPlayingEntry] = useState<Entry | null>(null);
  const [timeCapsuleMode, setTimeCapsuleMode] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const userEntries = UserDataManager.getUserEntries(user.id);
      const userLastVisit = UserDataManager.getUserLastVisit(user.id);
      
      setEntries(userEntries);
      setLastVisit(userLastVisit);
      
      // Update unlock status for entries
      const now = new Date();
      const updatedEntries = userEntries.map(entry => ({
        ...entry,
        isUnlocked: new Date(entry.unlockDate) <= now && !timeCapsuleMode
      }));
      
      if (JSON.stringify(updatedEntries) !== JSON.stringify(userEntries)) {
        setEntries(updatedEntries);
        UserDataManager.saveUserEntries(user.id, updatedEntries);
      }
      
      // Update last visit timestamp
      UserDataManager.saveUserLastVisit(user.id, now.toISOString());
    }
  }, [user, timeCapsuleMode]);

  // Save entries to storage whenever entries change
  useEffect(() => {
    if (user && entries.length > 0) {
      UserDataManager.saveUserEntries(user.id, entries);
    }
  }, [entries, user]);

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

  const handleSaveEntry = (newEntry: Omit<Entry, 'id' | 'userId'>) => {
    if (!user) return;
    
    const entry: Entry = {
      ...newEntry,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      isUnlocked: new Date(newEntry.unlockDate) <= new Date() && !timeCapsuleMode
    };
    
    setEntries(prev => [...prev, entry]);
    setShowNewEntry(false);
  };

  const handlePlayEntry = (entry: Entry) => {
    // Security check: ensure user can only play their own entries
    if (entry.userId !== user?.id || !entry.isUnlocked) {
      console.warn('Unauthorized access attempt to entry:', entry.id);
      return;
    }
    setPlayingEntry(entry);
  };

  const handleSaveReflection = (entryId: string, reflection: string) => {
    if (!user) return;
    
    setEntries(prev => 
      prev.map(entry => {
        // Security check: ensure user can only modify their own entries
        if (entry.id === entryId && entry.userId === user.id) {
          return { ...entry, reflection };
        }
        return entry;
      })
    );
  };

  const handleLogout = () => {
    logout();
    setEntries([]);
    setLastVisit(null);
    setShowNewEntry(false);
    setShowSettings(false);
    setPlayingEntry(null);
  };

  // Filter entries to show only user's entries (additional security layer)
  const userEntries = entries.filter(entry => entry.userId === user?.id);

  const filteredEntries = timeCapsuleMode 
    ? userEntries.filter(entry => {
        const oneYearFromCreation = new Date(entry.recordedDate);
        oneYearFromCreation.setFullYear(oneYearFromCreation.getFullYear() + 1);
        return oneYearFromCreation <= new Date();
      })
    : userEntries;

  const newlyUnlockedEntries = getNewlyUnlockedEntries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
        <Header 
          onNewEntry={() => setShowNewEntry(true)}
          onSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          currentUser={user || { name: "User", email: "user@example.com" }}
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

        {playingEntry && playingEntry.userId === user?.id && (
          <AudioPlaybackModal
            entry={playingEntry}
            onClose={() => setPlayingEntry(null)}
            onSaveReflection={handleSaveReflection}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
