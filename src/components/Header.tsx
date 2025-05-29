
import { Button } from "@/components/ui/button";
import { Plus, Headphones, User, Settings, LogOut, Home, BarChart3, Info, Mail, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onNewEntry: () => void;
  onSettings: () => void;
  onLogout: () => void;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const Header = ({ onNewEntry, onSettings, onLogout, currentUser }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navigationItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/contact", icon: Mail, label: "Contact" },
  ];

  return (
    <header className="flex items-center justify-between py-4 border-b border-white/10 relative">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-white">EchoVerse</h1>
            <p className="text-purple-200 text-sm">Your Audio Timeline</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <Link to={item.to}>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onNewEntry}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2 hidden sm:flex"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>

        {/* Mobile New Entry Button */}
        <Button
          onClick={onNewEntry}
          className="bg-purple-600 hover:bg-purple-700 text-white sm:hidden"
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{currentUser?.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 z-50">
          <div className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
