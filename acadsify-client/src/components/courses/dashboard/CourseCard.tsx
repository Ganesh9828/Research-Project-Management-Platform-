import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MoreVertical, Users } from 'lucide-react';
import { Course } from '../../../types';
import { cn } from '../../../lib/utils';

const backgroundColors = [
  'bg-blue-600',
  'bg-purple-600',
  'bg-green-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-orange-600',
];

export function CourseCard({ courseId, role }: { courseId: string; role: 'student' | 'teacher' }) {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  const randomColor = React.useMemo(() => {
    const index = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[index];
  }, []);

  return (
    <Link
      to={`/courses/${course.id}`}
      className="block group rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
    >
      <div className={cn('h-32 relative p-6', randomColor)}>
        {course && (
          <>
            <h3 className="text-2xl font-bold text-white">{course.title}</h3>
            <p className="text-white/80 mt-1 truncate">{course.description}</p>
          </>
        )}
        <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10">
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="bg-white p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents.length} students</span>
          </div>
          {role === 'teacher' && (
            <span className="text-sm text-gray-500">
              {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
