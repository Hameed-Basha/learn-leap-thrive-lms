import { supabase } from '@/lib/supabase';

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  position: number;
  lessons?: Lesson[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content?: string;
  video_url?: string;
  position: number;
  duration?: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get all modules for a course
 * @param courseId Course ID
 */
export const getModulesByCourse = async (courseId: string): Promise<{ data: Module[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('position');

  if (error) {
    console.error('Error fetching modules:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Get a module by ID with its lessons
 * @param moduleId Module ID
 */
export const getModuleWithLessons = async (moduleId: string): Promise<{ data: Module | null; error: any }> => {
  const { data, error } = await supabase
    .from('modules')
    .select(`
      *,
      lessons:lessons(*)
    `)
    .eq('id', moduleId)
    .single();
    
  if (error) {
    console.error('Error fetching module:', error);
    return { data: null, error };
  }
  
  // Sort lessons by position
  if (data.lessons) {
    data.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position);
  }

  return { data, error: null };
};

/**
 * Get a lesson by ID
 * @param lessonId Lesson ID
 */
export const getLesson = async (lessonId: string): Promise<{ data: Lesson | null; error: any }> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
    
  if (error) {
    console.error('Error fetching lesson:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Get all modules with lessons for a course
 * @param courseId Course ID
 */
export const getCourseContent = async (courseId: string): Promise<{ data: Module[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('modules')
    .select(`
      *,
      lessons:lessons(*)
    `)
    .eq('course_id', courseId)
    .order('position');
    
  if (error) {
    console.error('Error fetching course content:', error);
    return { data: null, error };
  }
  
  // Sort lessons within each module by position
  if (data) {
    data.forEach(module => {
      if (module.lessons) {
        module.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position);
      }
    });
  }

  return { data, error: null };
};

/**
 * Create a new module
 * @param moduleData Module data
 */
export const createModule = async (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Module | null; error: any }> => {
  const { data, error } = await supabase
    .from('modules')
    .insert([moduleData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating module:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Update a module
 * @param moduleId Module ID
 * @param updates Module updates
 */
export const updateModule = async (moduleId: string, updates: Partial<Module>): Promise<{ data: Module | null; error: any }> => {
  const { data, error } = await supabase
    .from('modules')
    .update(updates)
    .eq('id', moduleId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating module:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Delete a module
 * @param moduleId Module ID
 */
export const deleteModule = async (moduleId: string): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId);
    
  if (error) {
    console.error('Error deleting module:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

/**
 * Create a new lesson
 * @param lessonData Lesson data
 */
export const createLesson = async (lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Lesson | null; error: any }> => {
  const { data, error } = await supabase
    .from('lessons')
    .insert([lessonData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating lesson:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Update a lesson
 * @param lessonId Lesson ID
 * @param updates Lesson updates
 */
export const updateLesson = async (lessonId: string, updates: Partial<Lesson>): Promise<{ data: Lesson | null; error: any }> => {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', lessonId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating lesson:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Delete a lesson
 * @param lessonId Lesson ID
 */
export const deleteLesson = async (lessonId: string): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
    
  if (error) {
    console.error('Error deleting lesson:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
}; 