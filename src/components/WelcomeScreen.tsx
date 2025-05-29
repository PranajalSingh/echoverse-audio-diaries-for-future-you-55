
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Timer, Headphones, Home, BarChart3, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface WelcomeScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export const WelcomeScreen = ({ onLogin }: WelcomeScreenProps) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError("Please enter your name");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Handle registration
      const success = await register(email, password, name);
      if (!success) {
        setError("An account with this email already exists");
      }
    } else {
      // Handle login
      const success = await onLogin(email, password);
      if (!success) {
        setError("Invalid email or password");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <header className="flex items-center justify-between py-4 px-4 border-b border-white/10">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EchoVerse</h1>
              <p className="text-purple-200 text-sm">Your Audio Timeline</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
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
                <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsSignUp(value === "register")}>
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Input
                        type="password"
                        placeholder="Password (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        required
                        disabled={isLoading}
                      />
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
