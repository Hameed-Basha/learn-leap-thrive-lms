
import { supabase } from '@/lib/supabase';

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor_id: string;
  is_published: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  instructor_name?: string;
  enrollment_count?: number;
}

// Get all published courses
export const getPublishedCourses = async (): Promise<{ data: Course[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id(name),
      enrollments:enrollments(count)
    `)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching courses:', error);
    return { data: null, error };
  }

  // Transform the data to match the expected format
  const transformedData = data.map(course => ({
    ...course,
    instructor_name: course.profiles?.name,
    enrollment_count: course.enrollments?.[0]?.count || 0
  }));

  return { data: transformedData, error: null };
};

// Get course by ID
export const getCourseById = async (courseId: string): Promise<{ data: Course | null; error: any }> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id(name),
      enrollments:enrollments(count)
    `)
    .eq('id', courseId)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    return { data: null, error };
  }

  // Transform to match the expected format
  const transformedData = {
    ...data,
    instructor_name: data.profiles?.name,
    enrollment_count: data.enrollments?.[0]?.count || 0
  };

  return { data: transformedData, error: null };
};

// Get courses by instructor ID
export const getInstructorCourses = async (instructorId: string): Promise<{ data: Course[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id(name),
      enrollments:enrollments(count)
    `)
    .eq('instructor_id', instructorId);

  if (error) {
    console.error('Error fetching instructor courses:', error);
    return { data: null, error };
  }

  // Transform the data
  const transformedData = data.map(course => ({
    ...course,
    instructor_name: course.profiles?.name,
    enrollment_count: course.enrollments?.[0]?.count || 0
  }));

  return { data: transformedData, error: null };
};

// Create a new course
export const createCourse = async (courseData: Partial<Course>): Promise<{ data: Course | null; error: any }> => {
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Update a course
export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<{ data: Course | null; error: any }> => {
  const { data, error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('id', courseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating course:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) {
    console.error('Error deleting course:', error);
    return { error };
  }

  return { error: null };
};

// Enroll a user in a course
export const enrollUserInCourse = async (userId: string, courseId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('enrollments')
    .insert([
      { user_id: userId, course_id: courseId }
    ]);

  if (error) {
    console.error('Error enrolling in course:', error);
    return { error };
  }

  return { error: null };
};

// Check if a user is enrolled in a course
export const isUserEnrolled = async (userId: string, courseId: string): Promise<{ enrolled: boolean; error: any }> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    console.error('Error checking enrollment:', error);
    return { enrolled: false, error };
  }

  return { enrolled: !!data, error: null };
};
