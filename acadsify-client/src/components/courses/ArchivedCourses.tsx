import { CourseCard } from "./dashboard/CourseCard";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../layout/sidebar";
import { Header } from "../layout/header";

export function ArchivedCourses() {
  const { courses } = useAuth();
  const { user } = useAuth();

  // Mock archived courses
  const archivedCourses = courses.slice(0, 2).map((course) => ({
    ...course,
    archived: true,
  }));

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Archived Classes
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archivedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  courseId={course.id}
                  role={user?.role === "teacher" ? "teacher" : "student"}
                />
              ))}
            </div>

            {archivedCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No archived classes
                </h3>
                <p className="text-gray-500">
                  Classes that you archive will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
