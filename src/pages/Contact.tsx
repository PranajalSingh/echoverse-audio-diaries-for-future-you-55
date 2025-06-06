
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Contact = () => {
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted");
  };

  return (
    <Layout>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto px-4">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      defaultValue={user?.name || ""}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      defaultValue={user?.email || ""}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-purple-200 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" />
                <span className="text-purple-200 text-sm sm:text-base break-all">support@echoverse.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" />
                <span className="text-purple-200 text-sm sm:text-base">Live Chat Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" />
                <span className="text-purple-200 text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" />
                <span className="text-purple-200 text-sm sm:text-base">San Francisco, CA</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-purple-200 text-sm sm:text-base">
                <p><strong>Monday - Friday:</strong> 9AM - 6PM PST</p>
                <p><strong>Saturday:</strong> 10AM - 4PM PST</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
