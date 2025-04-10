
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  enrollmentCount: number;
  duration: string;
  progress?: number; // For students
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'assignment';
  completed?: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  completionDate: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'john@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane Instructor',
    email: 'jane@example.com',
    role: 'instructor',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS and JavaScript to build modern websites.',
    instructor: 'Jane Instructor',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
    enrollmentCount: 135,
    duration: '8 weeks',
    progress: 65,
    modules: [
      {
        id: 'm1',
        title: 'HTML Fundamentals',
        lessons: [
          { id: 'l1', title: 'Basic HTML Structure', type: 'video', completed: true },
          { id: 'l2', title: 'Working with Forms', type: 'video', completed: true },
          { id: 'l3', title: 'HTML Assessment', type: 'quiz', completed: true }
        ]
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        lessons: [
          { id: 'l4', title: 'CSS Selectors', type: 'video', completed: true },
          { id: 'l5', title: 'Flexbox and Grid', type: 'video', completed: false },
          { id: 'l6', title: 'CSS Project', type: 'assignment', completed: false }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Take your JavaScript skills to the next level with modern features and patterns.',
    instructor: 'Jane Instructor',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    enrollmentCount: 98,
    duration: '10 weeks',
    progress: 25,
    modules: [
      {
        id: 'm1',
        title: 'Modern JS Features',
        lessons: [
          { id: 'l1', title: 'ES6+ Syntax', type: 'video', completed: true },
          { id: 'l2', title: 'Promises and Async/Await', type: 'video', completed: false },
          { id: 'l3', title: 'JS Modules', type: 'quiz', completed: false }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'React Framework Fundamentals',
    description: 'Build interactive UIs with React, the popular JavaScript library.',
    instructor: 'Jane Instructor',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
    enrollmentCount: 212,
    duration: '12 weeks',
    progress: 12,
    modules: []
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    description: 'Create scalable and efficient backend applications with Node.js and Express.',
    instructor: 'Dave Developer',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    enrollmentCount: 87,
    duration: '8 weeks',
    progress: 0,
    modules: []
  }
];

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    courseId: '1',
    courseTitle: 'Introduction to Web Development',
    completionDate: 'March 15, 2024'
  }
];

// Current user for development
export const currentUser = mockUsers[0]; // Student view by default
