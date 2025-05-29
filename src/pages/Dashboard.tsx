import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Clock, Headphones, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserDataManager } from "../utils/userDataManager";
import type { Entry } from "./Index";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (user) {
      const userEntries = UserDataManager.getUserEntries(user.id);
      setEntries(userEntries);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const totalEntries = entries.length;
  const unlockedEntries = entries.filter(entry => entry.isUnlocked).length;
  const lockedEntries = totalEntries - unlockedEntries;
  
  // Get entries from this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthEntries = entries.filter(entry => {
    const entryDate = new Date(entry.recordedDate);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    {
      title: "Total Entries",
      value: totalEntries.toString(),
      description: "Audio diary entries recorded",
      icon: Headphones,
    },
    {
      title: "Unlocked",
      value: unlockedEntries.toString(),
      description: "Entries available to play",
      icon: Calendar,
    },
    {
      title: "Locked",
      value: lockedEntries.toString(),
      description: "Future entries waiting",
      icon: Clock,
    },
    {
      title: "This Month",
      value: thisMonthEntries.toString(),
      description: "New entries recorded",
      icon: BarChart3,
    },
  ];

  // Get recent entries (last 5)
  const recentEntries = entries
    .sort((a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime())
    .slice(0, 5);

  // Get upcoming unlocks
  const upcomingUnlocks = entries
    .filter(entry => !entry.isUnlocked)
    .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeUntilUnlock = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diffTime = unlock.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Available now";
    if (diffDays === 1) return "Unlocks tomorrow";
    if (diffDays < 30) return `Unlocks in ${diffDays} days`;
    if (diffDays < 365) {
      const months = Math.ceil(diffDays / 30);
      return `Unlocks in ${months} month${months > 1 ? 's' : ''}`;
    }
    const years = Math.ceil(diffDays / 365);
    return `Unlocks in ${years} year${years > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
        <Header 
          onNewEntry={handleGoHome}
          onSettings={() => {}}
          onLogout={handleLogout}
          currentUser={user}
        />
        
        <main className="mt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-purple-200">Overview of your audio diary journey</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-white/10 border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-purple-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-purple-200">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalEntries === 0 ? (
            // New user experience
            <div className="text-center py-12">
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 max-w-2xl mx-auto">
                <Headphones className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to EchoVerse!</h2>
                <p className="text-purple-200 mb-6">
                  You haven't created any audio diary entries yet. Start your journey by recording your first thoughts, memories, or dreams to unlock in the future.
                </p>
                <Button
                  onClick={handleGoHome}
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Entry
                </Button>
              </div>
            </div>
          ) : (
            // Existing user experience
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className="text-purple-200">
                    Your latest diary entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentEntries.length > 0 ? (
                    <div className="space-y-4">
                      {recentEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${entry.isUnlocked ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{entry.title}</p>
                            <p className="text-xs text-purple-200">
                              {entry.isUnlocked ? 'Available' : 'Locked'} • {formatDate(entry.recordedDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-200 text-sm">No entries yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Upcoming Unlocks</CardTitle>
                  <CardDescription className="text-purple-200">
                    Entries waiting to be revealed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingUnlocks.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingUnlocks.map((entry) => (
                        <div key={entry.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{entry.title}</p>
                            <p className="text-xs text-purple-200">{getTimeUntilUnlock(entry.unlockDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-200 text-sm">All entries are unlocked</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
