import React, { createContext, useContext, useState, useEffect } from "react";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import firebaseApp from "../firebase/firebase.config";
import { Profile } from "../types/index";

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading] = useState(true);
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<Profile[]>([]);

  const fetchUsers = async () => {
      try {
          const response = await fetch("http://localhost:4000/api/users", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });
          if (!response.ok) {
              throw new Error("Failed to fetch users");
          }
          const usersData = await response.json();
          setUsers(usersData);
      } catch (error) {
          console.error("Error fetching users:", error);
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async (role: string) => {
    console.log("Fetching courses...");
    const token = localStorage.getItem("token");
    if (!token || user === null) return; // Ensure user is not null

    try {
      const response = await fetch("http://localhost:4000/api/courses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const coursesData = await response.json();
      console.log("Fetched courses data:", coursesData); // Log the fetched courses data
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const login = (userData: Profile) => {
    setUser(userData);
  };

  const getUserRole = async (userId: string) => {
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }
      const data = await response.json(); 
      return data.role; 

    } catch (error) {
      console.error("Error fetching user role:", error); // Log the error
      return null; 
    }
  };


  const handleSignIn = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, email: userEmail } = userCredential.user;
      const token = await userCredential.user.getIdToken();

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      console.log("Fetching user role for UID:", uid); // Log the UID being fetched
      const userRole = await getUserRole(uid);
      if (!userRole) {
        throw new Error("User role not found");
      }
      console.log("User Email:", userEmail);
      console.log("User UID:", uid);
      console.log("User Role:", userRole);
      setUser({
        id: uid,
        email: userEmail || "",
        full_name: "",
        firebaseUID: uid, // Added firebaseUID property
        role: userRole,
        created_at: "",
        updated_at: "",
      });

      await fetchUserProfile(); // Fetch user profile after setting user state
      console.log("User state after login:", user); // Log the user state for debugging

      await fetchCourses(userRole); // Fetch courses after user sign-in based on role
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleSignUp = async (
    fullName: string,
    password: string,
    email: string,
    role: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUID: uid,
          fullName,
          password,
          email,
          role,
        }),
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const saveUserInterests = async (interests: string[], firebaseUID: string) => {
    try {
        const response = await fetch(`http://localhost:4000/api/users/${firebaseUID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ interests }), 
        });

        if (!response.ok) {
            throw new Error("Failed to save interests");
        }

        const result = await response.json();
        console.log("Interests saved:", result);
    } catch (error) {
        console.error("Error saving interests:", error);
    }
  };


  const updateUserProfile = async (userId: string, profileData: Profile) => {
    if (user) {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: profileData.full_name
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const updatedUser = await response.json();
        setUser({ ...user, ...updatedUser });
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile");
      }
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUser((prev) => ({ ...prev, ...userData }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        users,
        courses,
        handleSignIn,
        handleSignUp,
        handleSignOut,
        fetchUserProfile,
        login,
        getUserRole,
        updateUserProfile,
        saveUserInterests, // Ensure this is included
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      loading: true,
      handleSignIn: () => {},
      handleSignOut: () => {},
      users: [],
      courses: [],
    };
  }
  return context;
};

export default AuthContext;
