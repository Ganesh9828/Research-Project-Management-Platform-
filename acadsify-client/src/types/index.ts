
export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  firebaseUID: string;
  role: string;
  created_at: string;
  updated_at: string;
  assignedTeacher?: string | null;
  assignedStudents?: string[];
  maxStudents?: number;
  domains?: {
    id: string;
    name: string;
    keywords: string[];
  }[];
  interests?: string[];
}


export interface Domain {
  [key: string]: {
    [subdomain: string]: string[]; // Each subdomain maps to an array of topics
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;  
}

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: Date;
  url?: string;
  citations?: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  domains: Domain[];
  supervisor: string;
  team: string[];
  status: 'proposed' | 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
  milestones: Milestone[];
  publications: Publication[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedAt: Date;
  domains?: Domain[];
  assignedStudents?: string[];
  assignedTeacher?: string;
  maxStudents?: number;
  publications?: Publication[];
  researchProjects?: ResearchProject[];
  expertise?: string[];
  bio?: string;
  academicHistory?: {
    degree: string;
    institution: string;
    year: number;
  }[];
}

export interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}
export interface CourseAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'open' | 'closed';
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrollmentDate: Date;
}
export interface CourseFeedback {
  id: string;
  courseId: string;
  studentId: string;
  feedback: string;
  createdAt: Date;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  enrolledStudents: string[];
  createdAt: Date;
  updatedAt: Date;
  materials: CourseMaterial[];
  assignments: CourseAssignment[];
  feedbacks: CourseFeedback[];
}
export interface CourseInstructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  joinedAt: Date;
  domains?: Domain[];
  expertise?: string[];
  bio?: string;
  academicHistory?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  publications?: Publication[];
  researchProjects?: ResearchProject[];
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  joinedAt: Date;
  domains?: Domain[];
  expertise?: string[];
  bio?: string;
  academicHistory?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  publications?: Publication[];
  researchProjects?: ResearchProject[];
}
export interface CourseFeedback {
  id: string;
  courseId: string;
  studentId: string;
  feedback: string;
  createdAt: Date;
}
export interface CourseAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'open' | 'closed';
}

export interface Material {
  id: string;
  title: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'open' | 'closed';
}


