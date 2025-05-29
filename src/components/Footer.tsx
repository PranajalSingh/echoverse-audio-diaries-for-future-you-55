
import { Headphones, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">EchoVerse</h3>
            </div>
            <p className="text-purple-200 text-sm">
              Create audio time capsules and connect with your future self through the power of voice.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-200 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-200 text-sm">
            © 2024 EchoVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <span className="text-purple-200 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-purple-200 text-sm">for your future self</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
