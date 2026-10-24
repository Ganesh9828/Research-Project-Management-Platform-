import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.string(),
  dueTime: z.string(),
  totalPoints: z.string().transform(Number),
  courseId: z.string().min(1, 'Course ID is required'), // New field for course ID
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => void;
  type: 'create' | 'submit';
  existingAssignment?: {
    title: string;
    description: string;
    dueDate: string;
    totalPoints: number;
  };
  courses: { id: string; title: string }[]; // New prop for available courses
}

export function AssignmentModalUpdated({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type,
  existingAssignment,
  courses // New prop
}: AssignmentModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: existingAssignment,
  });

  useEffect(() => {
    if (existingAssignment) {
      reset(existingAssignment);
    }
  }, [existingAssignment, reset]);

  const handleFormSubmit = (data: AssignmentFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {type === 'create' ? 'Create Assignment' : 'Submit Assignment'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              {...register('title')}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.title && "border-red-500"
              )}
              placeholder="Enter assignment title"
              readOnly={type === 'submit'}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.description && "border-red-500"
              )}
              rows={4}
              placeholder={type === 'create' ? "Enter assignment instructions" : "Enter your submission notes"}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {type === 'create' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      {...register('dueDate')}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      {...register('dueTime')}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Points
                </label>
                <input
                  type="number"
                  {...register('totalPoints')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total points"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select {...register('courseId')} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="mt-1 text-sm text-red-500">{errors.courseId.message}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {type === 'create' ? 'Create Assignment' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
