import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/sidebar";
import { Header } from "./components/layout/header";
import { StudentDashboard } from "./components/courses/dashboard/StudentDashboard";
import { TeacherDashboard } from "./components/courses/dashboard/TeacherDashboard";
import { AdminDashboard } from "./components/courses/dashboard/AdminDashboard";
import { Calendar } from "./components/calendar/Calendar";
import { TodoList } from "./components/todo/TodoList";
import { CourseView } from "./components/courses/CourseView";
import { ArchivedCourses } from "./components/courses/ArchivedCourses";
import UserManagement from "./components/admin/UserManagement";
import { DomainMatchingSystem } from "./components/admin/DomainMatchingSystem";
import { MatchResultsPage } from "./components/admin/MatchResultsPage";
import { ThemeCustomizer } from "./components/admin/ThemeCustomizer";
import { Settings } from "./components/settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { Home } from "./components/home";
import ProfilePage from "./components/ProfilePage";
import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Sidebar />}
        {user && <Header />}
        <main className={user ? "ml pt-16 min-h-screen" : "pt-16 min-h-screen"}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === "admin" ? (
                    <AdminDashboard />
                  ) : user?.role === "teacher" ? (
                    <TeacherDashboard />
                  ) : (
                    <StudentDashboard />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <CourseView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived"
              element={
                <ProtectedRoute>
                  <ArchivedCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes */}
            <>
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/theme"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ThemeCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/matching"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DomainMatchingSystem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/match-results"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MatchResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </>
            <Route
              path="/settings/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
