import { useAuth } from "../../../contexts/AuthContext";
import { Course } from "../../../types/index";
import { Plus } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { Header } from "../../layout/header"; 
import { Sidebar } from "../../layout/sidebar";

export function StudentDashboard() {
  const { user } = useAuth();
  const courses: Course[] = [];

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                Join Class
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  courseId={course.id}
                  role="student"
                />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No classes yet
                </h3>
                <p className="text-gray-500">
                  Join a class to get started with your learning journey
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
