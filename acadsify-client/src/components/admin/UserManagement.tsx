import React, { useState, useEffect } from "react";
import { Sidebar } from "../layout/sidebar";
import { Header } from "../layout/header";
import firebaseApp from "../../firebase/firebase.config";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users");
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const data = await response.json();
      const usersWithId = data.map((user: any) => ({
        ...user,
        id: user._id,
      }));
      setUsers(usersWithId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const response = await fetch(
          `http://localhost:4000/api/users/${editingUserId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error(`Error updating user: ${response.statusText}`);
        }
      } else {
        const response = await fetch("http://localhost:4000/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error creating user: ${response.statusText}`);
        }
      }
      setFormData({ fullName: "", email: "", role: "", password: "" });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  }) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (userId: number) => {
    if (!userId) {
      console.error("Invalid userId for delete:", userId);
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage and edit users in the application
                </p>
              </div>
            </div>

            <h1>User Management</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-lg transition-colors duration-300">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground transition-colors duration-300"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground transition-colors duration-300"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required={!editingUserId}
                className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground transition-colors duration-300"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground transition-colors duration-300"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md shadow-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-300"
              >
                {editingUserId ? "Update User" : "Add User"}
              </button>
            </form>

            <table className="min-w-full bg-card border border-border rounded-lg shadow-lg mt-6">
              <thead>
                <tr className="text-primary-foreground border-b border-border">
                  <th className="px-4 py-2 text-left">User ID</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user: {
                    id: number;
                    fullName: string;
                    email: string;
                    role: string;
                  }) => (
                    <tr key={user.id} className="border-b border-border hover:bg-primary/10 transition-colors duration-300">
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.fullName}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
