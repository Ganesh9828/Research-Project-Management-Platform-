import React, { useEffect, useState } from "react";
import { Profile } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  Mail,
  CheckCircle,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import axios from "axios";
import { Sidebar } from "../layout/sidebar";
import { Header } from "../layout/header";

interface MatchResult {
  studentId: string;
  teacherId: string;
  similarity: number;
  matchedInterests: string[];
}

export function DomainMatchingSystem() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [autoMatching, setAutoMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Fetch users from backend API with correct endpoint
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const teachers = users.filter((user: Profile) => user.role === "teacher" && user.id);
  const students = users.filter((user: Profile) => user.role === "student" && user.id);

  const getUserName = (user: Profile) => user.full_name || user.email || user.id;

  const getDraggableId = (user: Profile, prefix: string) => `${prefix}-${user.id}`;

  const performAutoMatching = async (
    strictMode: boolean = false
  ): Promise<void> => {
    setAutoMatching(true);
    try {
      const response = await axios.get("/api/admin/matching");
      setMatchResults(response.data.results);
      setNotifications((prev) => [
        ...prev,
        `Auto-matching completed in ${strictMode ? "strict" : "suggested"} mode`,
      ]);
    } catch (error) {
      console.error("Error during auto-matching:", error);
      setNotifications((prev) => [...prev, "Error during auto-matching"]);
    } finally {
      setAutoMatching(false);
    }
  };

  const handleAssignment = (studentId: string, teacherId: string): void => {
    setNotifications((prev) => [
      ...prev,
      `Successfully assigned student to teacher`,
    ]);
  };

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const studentId = result.draggableId.replace("student-", "");
    const teacherId = result.destination.droppableId.replace("teacher-droppable-", "");

    handleAssignment(studentId, teacherId);
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
          <h1 className="text-3xl font-bold text-gray-900">Domain Matching System</h1>
          <p className="mt-2 text-gray-600">
            Automatically match students to teachers based on research interests
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => performAutoMatching(true)}
            disabled={autoMatching}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            {autoMatching ? "Processing..." : "Strict Assign"}
          </button>
          <button
            onClick={async () => {
              setAutoMatching(true);
              try {
                const response = await fetch('/api/admin/assign-students-to-teachers', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                if (!response.ok) {
                  throw new Error('Failed to assign students to teachers');
                }
                const data = await response.json();
                setNotifications((prev) => [
                  ...prev,
                  'Suggestive emails sent successfully',
                ]);
                window.location.href = "/admin/match-results";
              } catch (error) {
                console.error('Error sending suggestive emails:', error);
                setNotifications((prev) => [
                  ...prev,
                  'Error sending suggestive emails',
                ]);
              } finally {
                setAutoMatching(false);
              }
            }}
            disabled={autoMatching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Mail className="w-5 h-5" />
            {autoMatching ? "Processing..." : "Suggest Matches"}
          </button>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="mb-6 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{notification}</span>
            </div>
          ))}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Droppable droppableId="teacher-droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-lg shadow-md p-4 space-y-4"
              >
                <h2 className="text-xl font-semibold flex items-center gap-2 border-b pb-4 mb-4">
                  <Users className="w-5 h-5" />
                  Teachers ({teachers.length})
                </h2>
                {teachers.map((teacher: Profile, index: number) => (
                  <Draggable
                    key={`teacher-${teacher.id}`}
                    draggableId={`teacher-droppable-${teacher.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200" />
                            <div>
                              <h3 className="font-medium">{getUserName(teacher)}</h3>
                              <p className="text-sm text-gray-500">{teacher.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {teacher.assignedStudents?.length || 0}/{teacher.maxStudents || 4} students
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">Research Interests</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {teacher.interests?.map((interest: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="student-droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-lg shadow-md p-4 space-y-4"
              >
                <h2 className="text-xl font-semibold flex items-center gap-2 border-b pb-4 mb-4">
                  <Users className="w-5 h-5" />
                  Students ({students.length})
                </h2>
                {students.map((student: Profile, index: number) => (
                  <Draggable
                    key={`student-${student.id}`}
                    draggableId={`student-droppable-${student.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200" />
                            <div>
                              <h3 className="font-medium">{getUserName(student)}</h3>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.assignedTeacher ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Assigned
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">Research Interests</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {student.interests?.map((interest: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
          </div>
        </div>
      </>
  );
}
