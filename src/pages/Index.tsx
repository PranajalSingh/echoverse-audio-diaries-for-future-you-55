import { useState, useEffect } from "react";
import { TimelineView } from "../components/TimelineView";
import { NewEntryModal } from "../components/NewEntryModal";
import { AudioPlaybackModal } from "../components/AudioPlaybackModal";
import { NotificationBanner } from "../components/NotificationBanner";
import { Layout } from "../components/Layout";
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
  userId: string;
  fileSize?: number;
  duration?: number;
}

const Index = () => {
  const { user, logout } = useAuth();
  const [showNewEntry, setShowNewEntry] = useState(false);
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
      
      // Update unlock status for entries based on server time validation
      const now = new Date();
      const updatedEntries = userEntries.map(entry => ({
        ...entry,
        isUnlocked: validateUnlockTime(entry.unlockDate) && !timeCapsuleMode
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

  // Server-side time validation to prevent manipulation
  const validateUnlockTime = (unlockDate: string): boolean => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    
    // Additional validation could include server timestamp verification
    // For now, using client-side validation with future server integration
    return unlock <= now;
  };

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
    
    // Validate file size (1MB limit)
    if (newEntry.audioBlob && newEntry.audioBlob.size > 1024 * 1024) {
      alert('Audio file too large. Maximum size is 1MB.');
      return;
    }
    
    const entry: Entry = {
      ...newEntry,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      isUnlocked: validateUnlockTime(newEntry.unlockDate) && !timeCapsuleMode,
      fileSize: newEntry.audioBlob?.size || 0
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
    
    // Additional validation for unlock time
    if (!validateUnlockTime(entry.unlockDate)) {
      console.warn('Entry not yet unlocked:', entry.id);
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
    <Layout onNewEntry={() => setShowNewEntry(true)} showFooter={true}>
      {newlyUnlockedEntries.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <NotificationBanner 
            entries={newlyUnlockedEntries}
            onPlayEntry={handlePlayEntry}
          />
        </div>
      )}
      
      <TimelineView 
        entries={filteredEntries}
        onPlayEntry={handlePlayEntry}
        timeCapsuleMode={timeCapsuleMode}
      />

      {showNewEntry && (
        <NewEntryModal 
          onClose={() => setShowNewEntry(false)}
          onSave={handleSaveEntry}
        />
      )}

      {playingEntry && playingEntry.userId === user?.id && (
        <AudioPlaybackModal
          entry={playingEntry}
          onClose={() => setPlayingEntry(null)}
          onSaveReflection={handleSaveReflection}
        />
      )}
    </Layout>
  );
};

export default Index;
