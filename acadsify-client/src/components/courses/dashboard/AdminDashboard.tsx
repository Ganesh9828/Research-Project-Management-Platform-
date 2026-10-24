import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, Activity } from 'lucide-react';
import axios from 'axios';
import { Sidebar } from '../../layout/sidebar';
import { Header } from '../../layout/header';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:4000/api/users');
        setUsers(usersResponse.data.users);
        
        const coursesResponse = await axios.get('http://localhost:4000/api/courses');
        setCourses(coursesResponse.data);
        
        // Assuming a theme endpoint exists
        const themeResponse = await axios.get('http://localhost:4000/api/theme');
        setTheme(themeResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Total Users', value:  0, icon: Users, color: 'bg-blue-500' },
    { title: 'Active Courses', value:  0, icon: BookOpen, color: 'bg-green-500' },
    { title: 'Upcoming Events', value: 12, icon: Calendar, color: 'bg-purple-500' },
    { title: 'System Load', value: '87%', icon: Activity, color: 'bg-orange-500' },
  ];

  return (
    <>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
              <Header />
    <div className="max-w-7xl mx-auto px-4 py-8" style={{ padding: '20px' }}>
      <h1 className="text-3xl font-bold text-primary-foreground mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-card rounded-lg shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">{stat.value}</span>
            </div>
            <h3 className="text-muted-foreground">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Recent Activities</h2>
          <div className="space-y-4">
            {/* Mock activity data */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-primary-foreground">System Health</h2>
          <div className="space-y-4">
            {/* Mock system health data */}
            {[
              { name: 'Server Uptime', value: '99.9%' },
              { name: 'Response Time', value: '120ms' },
              { name: 'Storage Used', value: '45%' },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold text-primary-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    </div>
          </div>
        </>
  );
}
