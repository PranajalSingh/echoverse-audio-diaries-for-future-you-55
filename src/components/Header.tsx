
import { Button } from "@/components/ui/button";
import { Plus, Headphones, User } from "lucide-react";

interface HeaderProps {
  onNewEntry: () => void;
}

export const Header = ({ onNewEntry }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">EchoVerse</h1>
          <p className="text-purple-200 text-sm">Your Audio Timeline</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onNewEntry}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
