
import { useState } from "react";
import { AudioRecorder } from "../components/AudioRecorder";
import { TimelineView } from "../components/TimelineView";
import { Header } from "../components/Header";
import { NewEntryModal } from "../components/NewEntryModal";
import { WelcomeScreen } from "../components/WelcomeScreen";

const Index = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([
    {
      id: "1",
      title: "First Day of College",
      mood: "excited",
      recordedDate: "2024-01-15",
      unlockDate: "2025-01-15",
      isUnlocked: false,
      audioUrl: null,
    },
    {
      id: "2", 
      title: "Summer Reflections",
      mood: "nostalgic",
      recordedDate: "2024-06-20",
      unlockDate: "2024-12-20",
      isUnlocked: true,
      audioUrl: "/placeholder-audio.mp3",
    }
  ]);

  if (!isAuthenticated) {
    return <WelcomeScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Header onNewEntry={() => setShowNewEntry(true)} />
        
        <main className="mt-8">
          <TimelineView entries={entries} />
        </main>

        {showNewEntry && (
          <NewEntryModal 
            onClose={() => setShowNewEntry(false)}
            onSave={(newEntry) => {
              setEntries([...entries, { ...newEntry, id: Date.now().toString() }]);
              setShowNewEntry(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
