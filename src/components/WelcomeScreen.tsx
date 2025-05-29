
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Timer, Headphones } from "lucide-react";

interface WelcomeScreenProps {
  onLogin: () => void;
}

export const WelcomeScreen = ({ onLogin }: WelcomeScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication for demo
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">EchoVerse</h1>
          </div>
          <p className="text-xl text-purple-200 mb-2">Audio Diaries for the Future You</p>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Record your thoughts, memories, and dreams. Set them to unlock in the future and rediscover your past self's voice across time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Music className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Record</h3>
                <p className="text-purple-200 text-sm">Capture your voice and thoughts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Timer className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Time Lock</h3>
                <p className="text-purple-200 text-sm">Set future unlock dates</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Headphones className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Rediscover</h3>
                <p className="text-purple-200 text-sm">Listen to your past self</p>
              </div>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Welcome to Your Timeline</CardTitle>
              <CardDescription className="text-purple-200">
                Sign in or create an account to start your audio diary journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                      required
                    />
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                      required
                    />
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
