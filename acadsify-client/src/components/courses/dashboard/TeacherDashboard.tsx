import { useAuth } from "../../../contexts/AuthContext";
import { Course } from "../../../types/index";
import { Plus } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { Header } from "../../layout/header";
import { Sidebar } from "../../layout/sidebar";

export function TeacherDashboard() {
  const { courses } = useAuth(); 
  const teacherCourses: Course[] = [] ;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teaching</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              Create Class
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teacherCourses.map((course) => (
              <CourseCard key={course.id} courseId={course.id} role="teacher" />
            ))}
          </div>

          {teacherCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No classes created
              </h3>
              <p className="text-gray-500">
                Create your first class to start teaching
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
