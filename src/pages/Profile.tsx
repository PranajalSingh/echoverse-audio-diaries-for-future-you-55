
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Headphones, User } from "lucide-react";

const Profile = () => {
  const currentUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: undefined, // Add the missing avatar property
    joinDate: "January 2024",
    totalEntries: 12,
    unlockedEntries: 8
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile saved");
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-purple-200">Manage your account settings and view your journey</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback className="bg-purple-600 text-white text-2xl">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{currentUser.name}</CardTitle>
                  <p className="text-purple-200">{currentUser.email}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Member since:</span>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      {currentUser.joinDate}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Headphones className="w-5 h-5 text-purple-300" />
                      <span className="text-purple-200">Total Entries: {currentUser.totalEntries}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-300" />
                      <span className="text-purple-200">Unlocked: {currentUser.unlockedEntries}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-300" />
                      <span className="text-purple-200">Locked: {currentUser.totalEntries - currentUser.unlockedEntries}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-purple-200 mb-2">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          defaultValue="John"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-purple-200 mb-2">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          defaultValue="Doe"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={currentUser.email}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-purple-200 mb-2">
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-purple-200 mb-2">
                          New Password
                        </label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-2">
                          Confirm Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" className="border-white/20 text-purple-200 hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
