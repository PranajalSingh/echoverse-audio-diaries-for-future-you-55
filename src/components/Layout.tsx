
import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SettingsModal } from "./SettingsModal";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  onNewEntry?: () => void;
  showFooter?: boolean;
}

export const Layout = ({ children, onNewEntry, showFooter = false }: LayoutProps) => {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [timeCapsuleMode, setTimeCapsuleMode] = useState(false);

  const handleNewEntry = () => {
    if (onNewEntry) {
      onNewEntry();
    } else {
      // Navigate to home page if no onNewEntry handler is provided
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        <Header 
          onNewEntry={handleNewEntry}
          onSettings={() => setShowSettings(true)}
          onLogout={logout}
          currentUser={user || { name: "User", email: "user@example.com" }}
        />
        
        <main className="mt-6 sm:mt-8">
          {children}
        </main>

        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            timeCapsuleMode={timeCapsuleMode}
            onTimeCapsuleModeChange={setTimeCapsuleMode}
          />
        )}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};
