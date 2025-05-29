
import { useState, useEffect } from "react";
import { AudioRecorder } from "../components/AudioRecorder";
import { TimelineView } from "../components/TimelineView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [timeCapsuleMode, setTimeCapsuleMode] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>(() => {
    const savedEntries = localStorage.getItem('userEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    return {
      name: userName || "User",
      email: userEmail || "user@example.com"
    };
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser);

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
      
      // Update current user data
      setCurrentUser(getCurrentUser());
    }
  }, [isAuthenticated, timeCapsuleMode]);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('userEntries', JSON.stringify(entries));
    }
  }, [entries, isAuthenticated]);

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

  const handleLogin = (email: string, password: string, name?: string) => {
    // Simple validation for demo purposes
    if (email && password && email.includes('@') && password.length >= 6) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      // Extract name from email if not provided, or use provided name
      const userName = name || email.split('@')[0];
      localStorage.setItem('userName', userName);
      
      setCurrentUser({ name: userName, email });
      return true;
    }
    return false;
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('lastVisit');
    localStorage.removeItem('userEntries');
    setEntries([]);
    setCurrentUser({ name: "User", email: "user@example.com" });
  };

  const filteredEntries = timeCapsuleMode 
    ? entries.filter(entry => {
        const oneYearFromCreation = new Date(entry.recordedDate);
        oneYearFromCreation.setFullYear(oneYearFromCreation.getFullYear() + 1);
        return oneYearFromCreation <= new Date();
      })
    : entries;

  if (!isAuthenticated) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  const newlyUnlockedEntries = getNewlyUnlockedEntries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
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
      <Footer />
    </div>
  );
};

export default Index;
