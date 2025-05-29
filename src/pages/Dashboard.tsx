
import { Header } from "../components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Clock, Headphones } from "lucide-react";

const Dashboard = () => {
  const currentUser = {
    name: "John Doe",
    email: "john@example.com"
  };

  const handleLogout = () => {
    // Will be implemented with authentication
    console.log("Logout clicked");
  };

  const stats = [
    {
      title: "Total Entries",
      value: "12",
      description: "Audio diary entries recorded",
      icon: Headphones,
    },
    {
      title: "Unlocked",
      value: "8",
      description: "Entries available to play",
      icon: Calendar,
    },
    {
      title: "Locked",
      value: "4",
      description: "Future entries waiting",
      icon: Clock,
    },
    {
      title: "This Month",
      value: "3",
      description: "New entries recorded",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Header 
          onNewEntry={() => {}}
          onSettings={() => {}}
          onLogout={handleLogout}
          currentUser={currentUser}
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-purple-200">
                  Your latest diary entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Summer Reflections unlocked</p>
                      <p className="text-xs text-purple-200">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Year Hopes recorded</p>
                      <p className="text-xs text-purple-200">1 week ago</p>
                    </div>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">First Day of College</p>
                      <p className="text-xs text-purple-200">Unlocks in 6 months</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Year Hopes</p>
                      <p className="text-xs text-purple-200">Unlocks in 11 months</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
