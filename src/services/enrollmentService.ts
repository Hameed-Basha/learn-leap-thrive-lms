import { supabase } from '@/lib/supabase';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  last_watched_position?: number;
  completed_at?: string;
}

/**
 * Enroll a user in a course
 * @param userId User ID
 * @param courseId Course ID
 */
export const enrollInCourse = async (userId: string, courseId: string): Promise<{ data: Enrollment | null; error: any }> => {
  // Check if already enrolled
  const { data: existing, error: checkError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking enrollment:', checkError);
    return { data: null, error: checkError };
  }

  // If already enrolled, return existing enrollment
  if (existing) {
    return { data: existing, error: null };
  }

  // If not enrolled, create new enrollment
  const { data, error } = await supabase
    .from('enrollments')
    .insert([
      { user_id: userId, course_id: courseId }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error enrolling in course:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Check if a user is enrolled in a course
 * @param userId User ID
 * @param courseId Course ID
 */
export const isUserEnrolled = async (userId: string, courseId: string): Promise<{ enrolled: boolean; error: any }> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (error) {
    console.error('Error checking enrollment:', error);
    return { enrolled: false, error };
  }

  return { enrolled: !!data, error: null };
};

/**
 * Get all enrollments for a user
 * @param userId User ID
 */
export const getUserEnrollments = async (userId: string): Promise<{ data: Enrollment[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Mark a lesson as complete for a user
 * @param userId User ID
 * @param lessonId Lesson ID
 */
export const markLessonComplete = async (userId: string, lessonId: string): Promise<{ data: Progress | null; error: any }> => {
  // Check if progress record exists
  const { data: existing, error: checkError } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking progress:', checkError);
    return { data: null, error: checkError };
  }

  // If record exists, update it
  if (existing) {
    const { data, error } = await supabase
      .from('progress')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      return { data: null, error };
    }

    return { data, error: null };
  }

  // If no record exists, create one
  const { data, error } = await supabase
    .from('progress')
    .insert([
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating progress:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Update a user's progress in a lesson
 * @param userId User ID
 * @param lessonId Lesson ID
 * @param lastPosition Video position in seconds
 */
export const updateLessonProgress = async (
  userId: string,
  lessonId: string,
  lastPosition: number
): Promise<{ data: Progress | null; error: any }> => {
  // Check if progress record exists
  const { data: existing, error: checkError } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking progress:', checkError);
    return { data: null, error: checkError };
  }

  // If record exists, update it
  if (existing) {
    const { data, error } = await supabase
      .from('progress')
      .update({
        last_watched_position: lastPosition,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      return { data: null, error };
    }

    return { data, error: null };
  }

  // If no record exists, create one
  const { data, error } = await supabase
    .from('progress')
    .insert([
      {
        user_id: userId,
        lesson_id: lessonId,
        last_watched_position: lastPosition,
        completed: false,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating progress:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Get a user's progress for a specific course
 * @param userId User ID
 * @param courseId Course ID
 */
export const getCourseProgress = async (userId: string, courseId: string): Promise<{ progress: number; error: any }> => {
  try {
    // First, get all lessons for the course
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId);

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return { progress: 0, error: modulesError };
    }

    // Extract all lesson IDs
    let totalLessons = 0;
    const lessonIds: string[] = [];
    
    modules.forEach(module => {
      if (module.lessons && module.lessons.length > 0) {
        module.lessons.forEach((lesson: any) => {
          lessonIds.push(lesson.id);
          totalLessons++;
        });
      }
    });

    if (totalLessons === 0) {
      return { progress: 0, error: null };
    }

    // Get completed lessons
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .in('lesson_id', lessonIds)
      .eq('completed', true);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return { progress: 0, error: progressError };
    }

    // Calculate progress percentage
    const completedLessons = progress ? progress.length : 0;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    return { progress: progressPercentage, error: null };
  } catch (error) {
    console.error('Error calculating course progress:', error);
    return { progress: 0, error };
  }
};

/**
 * Complete a course for a user
 * @param userId User ID
 * @param courseId Course ID
 */
export const completeCourse = async (userId: string, courseId: string): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from('enrollments')
    .update({
      completed_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('course_id', courseId);

  if (error) {
    console.error('Error completing course:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

/**
 * Get completed courses for a user
 * @param userId User ID
 */
export const getCompletedCourses = async (userId: string): Promise<{ data: any[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  if (error) {
    console.error('Error fetching completed courses:', error);
    return { data: null, error };
  }

  return { data, error: null };
}; 