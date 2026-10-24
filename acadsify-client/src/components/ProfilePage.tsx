import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import InterestManagement from "./InterestManagement";
import { Sidebar } from "./layout/sidebar";
import { Header } from "./layout/header";

interface Subdomain {
  [key: string]: string[];
}

interface Domain {
  [key: string]: Subdomain;
}

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.full_name || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleDisplayNameChange = async () => {
    if (user && user.id) {
      await updateUserProfile(user.id, {
        ...user,
        full_name: displayName,
      });
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />

          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary-foreground mb-8">
              Profile Page
            </h1>
            <div className="bg-card rounded-lg shadow-lg p-6 mb-6 transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary-foreground">
                <User className="w-5 h-5 text-primary-foreground" />
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Display Name
                  </label>

                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground transition-colors duration-300"
                  />
                  <button
                    onClick={handleDisplayNameChange}
                    type="button"
                    className="mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300"
                  >
                    Update Name
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            <InterestManagement />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
