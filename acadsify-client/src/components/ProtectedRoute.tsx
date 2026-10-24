import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { Loading } from "./Loading";
import { Unauthorized } from "./Unauthorized";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, login, getUserRole } = useAuth();

 
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRole = await getUserRole(currentUser.uid);
        
        login({
          email: currentUser.email || "",
          id: currentUser.uid,
          name: currentUser.displayName || "",
          role: userRole,
          joinedAt: new Date(),
        });
      } else {
        console.log("No user authenticated"); // Log if no user is authenticated
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe();
  }, [auth, login]);

  if (loading) {
    return <Loading />; // Show styled loading component while checking auth
  }

  
  if (!user) {
    console.log("No user authenticated, redirecting to login..."); // Log redirection

    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role:", user.role); // Log the user's role

    console.log("User not authorized, redirecting..."); // Log unauthorized access

    return <Unauthorized />; // Show styled unauthorized component
  }

  return <>{children}</>;
};

export default ProtectedRoute;
