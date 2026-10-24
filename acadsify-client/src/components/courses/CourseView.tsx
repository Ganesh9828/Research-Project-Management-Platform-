import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Users,
  Calendar,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AssignmentModalUpdated } from '../assignments/AssignmentModel';
import { AddCourseModel } from './AddCourseModel';
import { useAuth } from "../../contexts/AuthContext";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  status: 'open' | 'submitted' | 'graded';
  grade?: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  enrolledStudents: { id: string; name: string }[];
  createdAt: string;
}

export function CourseView() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { courses } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'stream' | 'materials' | 'assignments' | 'people'>('stream');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = React.useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);

  const [assignments] = React.useState<Assignment[]>([
    {
      id: '1',
      title: 'Research Paper Analysis',
      description: 'Analyze and summarize the provided research paper.',
      dueDate: new Date('2024-04-01'),
      totalPoints: 100,
      status: 'open'
    },
    {
      id: '2',
      title: 'Project Proposal',
      description: 'Submit your research project proposal.',
      dueDate: new Date('2024-04-15'),
      totalPoints: 150,
      status: 'submitted'
    }
  ]);

  const course = courses.find((c: Course) => c.id === courseId);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const handleAssignmentSubmit = (data: any) => {
    console.log('Assignment submitted:', data);
    // Handle assignment submission
  };

  const handleCreateAssignment = (data: any) => {
    console.log('Assignment created:', data);
    // Handle assignment creation
  };

  const tabs = [
    { id: 'stream', label: 'Stream', icon: MessageSquare },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'people', label: 'People', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-2 text-gray-600">{course.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents.length} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Assignments</h2>
                {user?.role === 'teacher' && (
                  <button
                    onClick={() => {
                      setSelectedAssignment(null);
                      setIsAssignmentModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create Assignment
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Due {assignment.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-1 text-xs font-semibold rounded-full",
                          assignment.status === 'submitted' && "bg-yellow-100 text-yellow-800",
                          assignment.status === 'graded' && "bg-green-100 text-green-800",
                          assignment.status === 'open' && "bg-blue-100 text-blue-800"
                        )}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        {assignment.grade && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100">
                            {assignment.grade}/{assignment.totalPoints}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {assignment.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                      {user?.role === 'student' && assignment.status === 'open' && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setIsAssignmentModalOpen(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Submit Assignment
                        </button>
                      )}
                      {user?.role === 'teacher' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                          View Submissions
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AssignmentModalUpdated
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSubmit={user?.role === 'teacher' ? handleCreateAssignment : handleAssignmentSubmit}
        type={user?.role === 'teacher' ? 'create' : 'submit'}
        courses={courses} // Pass available courses
      />
      <AddCourseModel
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSubmit={(data) => {
          console.log('Course added:', data);
          // Handle course addition logic
        }}
      />
    </div>
  );
}
