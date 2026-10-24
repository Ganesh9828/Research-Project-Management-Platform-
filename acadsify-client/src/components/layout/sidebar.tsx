import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  Layout,
  GraduationCap,
  MessageSquare,
  FileText,
  Video,
  Home,
  Clock,
  Archive,
  Percent
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

const adminLinks = [
  { to: '/dashboard', icon: Layout, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/admin/matching', icon: Percent, label: 'Domain Matching' },
  { to: '/admin/theme', icon: Settings, label: 'Theme' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const teacherLinks = [
  { to: '/dashboard', icon: Home, label: 'Classes' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/todo', icon: Clock, label: 'To-do' },
  { to: '/archived', icon: Archive, label: 'Archived classes' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const studentLinks = [
  { to: '/dashboard', icon: Home, label: 'Classes' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/todo', icon: Clock, label: 'To-do' },
  { to: '/archived', icon: Archive, label: 'Archived classes' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user } = useAuth();

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'teacher'
    ? teacherLinks
    : studentLinks;

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-primary/80 via-primary/60 to-secondary/80 border-r border-primary/50 fixed left-0 top-0 shadow-lg transition-colors duration-300">
      <div className="flex items-center gap-2 p-4 border-b border-primary/50">
        <GraduationCap className="w-8 h-8 text-white" />
        <h1 className="text-xl font-bold text-white">Classroom</h1>
      </div>
      
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-full transition-colors duration-300",
                isActive 
                  ? "bg-primary/70 text-white shadow-md" 
                  : "text-white hover:bg-primary/50 hover:text-white"
              )
            }
          >
            <link.icon className="w-5 h-5 text-white" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
