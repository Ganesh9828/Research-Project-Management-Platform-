import { 
  Users, 
  BookOpen, 
  Calendar, 
  Activity,
  Settings,
  Layout,
  Video,
  FileText,
  MessageSquare,
  Clock,
  Paintbrush
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';  

const AdminCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  color 
}: { 
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}) => (
  <Link
    to={to}
    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </Link>
);

export function AdminDashboard() {
  const { users, courses } = useAuth(); // Retrieve users and courses from context

  const stats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Courses',
      value: courses?.length || 0, // Ensure safety against null or undefined
      icon: BookOpen,
      color: 'bg-green-500',
    },
   
    {
      title: 'Inactive Cource',
      value: 0,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'System Load',
      value: '87%',
      icon: Activity,
      color: 'bg-orange-500',
    },
  ];

  const adminModules = [
    {
      title: 'Theme Customization',
      description: 'Customize the look and feel of the platform',
      icon: Paintbrush,
      to: '/admin/theme',
      color: 'bg-pink-500',
    },
    {
      title: 'Layout Settings',
      description: 'Manage platform layout and navigation',
      icon: Layout,
      to: '/admin/layout',
      color: 'bg-indigo-500',
    },
    {
      title: 'Virtual Classrooms',
      description: 'Configure video conferencing settings',
      icon: Video,
      to: '/admin/virtual-classrooms',
      color: 'bg-blue-500',
    },
    {
      title: 'Research Repository',
      description: 'Manage research papers and publications',
      icon: FileText,
      to: '/admin/repository',
      color: 'bg-green-500',
    },
    {
      title: 'Discussion Forums',
      description: 'Moderate academic discussions',
      icon: MessageSquare,
      to: '/admin/forums',
      color: 'bg-yellow-500',
    },
    {
      title: 'Appointment System',
      description: 'Configure meeting scheduling',
      icon: Clock,
      to: '/admin/appointments',
      color: 'bg-purple-500',
    },
  ];

  return (
    
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage and customize the academic platform
          </p>
        </div>
        <Link
          to="/admin/settings"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-600">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <AdminCard key={module.title} {...module} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">New user registered</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { name: 'Server Uptime', value: '99.9%' },
              { name: 'Response Time', value: '120ms' },
              { name: 'Storage Used', value: '45%' },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
