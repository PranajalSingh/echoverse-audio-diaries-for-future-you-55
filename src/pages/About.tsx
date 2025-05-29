
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Heart, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const About = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const features = [
    {
      icon: Clock,
      title: "Time Capsule Technology",
      description: "Record audio diaries that unlock on future dates you choose, creating a bridge between your present and future self."
    },
    {
      icon: Heart,
      title: "Personal & Private",
      description: "Your deepest thoughts, dreams, and reflections remain completely private. Only you can access your audio timeline."
    },
    {
      icon: Shield,
      title: "Secure & Encrypted",
      description: "All audio entries are securely stored and encrypted until their unlock date, ensuring your privacy and security."
    },
    {
      icon: Sparkles,
      title: "Meaningful Reflection",
      description: "Connect with your past self, track your growth, and discover patterns in your thoughts across time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
        <Header 
          onNewEntry={() => navigate('/')}
          onSettings={() => {}}
          onLogout={handleLogout}
          currentUser={user || { name: "User", email: "user@example.com" }}
        />
        
        <main className="mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">About EchoVerse</h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              A unique platform for creating audio time capsules that connect your present self with your future self through the power of voice.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-200">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-white/5 rounded-lg p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-purple-200 text-lg max-w-4xl mx-auto">
              EchoVerse believes in the power of voice to capture not just words, but emotions, intentions, and the essence of who we are in any given moment. By creating audio time capsules, we help you build a personal archive of growth, dreams, and memories that can inspire and guide your future self.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default About;
