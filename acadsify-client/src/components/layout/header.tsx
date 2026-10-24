import { useEffect, useState } from 'react';
import { Bell, Sun, Moon, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, fetchUserProfile } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!user || !user.fullName) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  return (
    <header className="h-16 bg-primary/90 border-b border-primary/50 shadow-md fixed top-0 right-0 left-64 z-10 backdrop-blur-sm transition-colors duration-300">
      <div className="h-full flex items-center justify-between px-6">
        <h2 className="text-xl font-semibold text-white">Welcome, {user?.fullName || ''}</h2>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full relative hover:bg-primary/70 transition-colors duration-300">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-primary/70 transition-colors duration-300"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </button>
          
          <a 
            href="/profile" 
            className="p-2 rounded-full hover:bg-primary/70 transition-colors duration-300"
          >
            <User className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </header>
  );
}
