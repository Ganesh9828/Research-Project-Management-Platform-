import React from "react";
import {
  Bell,
  Moon,
  Globe,
  Lock,
  Mail,
  User,
  Shield,
  Save,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../layout/sidebar";
import { Header } from "../layout/header";


export function Settings() {
  const { user, updateProfile } = useAuth();

  // Check if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <p className="text-red-600">You must be logged in to view this page.</p>
      </div>
    );
  }

  const [notifications, setNotifications] = React.useState({
    email: true,
    desktop: true,
    assignments: true,
    announcements: true,
  });

  const [theme, setTheme] = React.useState("light");
  const [language, setLanguage] = React.useState("en");

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="flex space-x-4 mb-6">
              <a
                href="/settings/profile"
                className="text-blue-600 hover:underline"
              >
                Profile Settings
              </a>
            </div>
            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user?.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700 capitalize">
                        {key} Notifications
                      </span>
                      <button
                        onClick={() =>
                          handleNotificationChange(
                            key as keyof typeof notifications
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Appearance
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Language Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language & Region
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </h2>

                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Change Password</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
