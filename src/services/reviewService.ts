import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_name?: string;
  user_avatar?: string;
}

/**
 * Get reviews for a course
 * @param courseId Course ID
 */
export const getCourseReviews = async (courseId: string): Promise<{ data: Review[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:profiles!user_id(name, avatar_url)
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching course reviews:', error);
    return { data: null, error };
  }
  
  // Transform the data to flatten the joined fields
  const transformedData = data.map(review => ({
    ...review,
    user_name: review.profiles?.name,
    user_avatar: review.profiles?.avatar_url,
    profiles: undefined // Remove the nested profiles object
  }));

  return { data: transformedData, error: null };
};

/**
 * Get a review by user and course
 * @param userId User ID
 * @param courseId Course ID
 */
export const getUserReviewForCourse = async (userId: string, courseId: string): Promise<{ data: Review | null; error: any }> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching user review:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Create or update a review
 * @param reviewData Review data
 */
export const submitReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'user_name' | 'user_avatar'>): Promise<{ data: Review | null; error: any }> => {
  // Check if review already exists
  const { data: existingReview, error: checkError } = await getUserReviewForCourse(reviewData.user_id, reviewData.course_id);
  
  if (checkError) {
    console.error('Error checking existing review:', checkError);
    return { data: null, error: checkError };
  }
  
  if (existingReview) {
    // Update existing review
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: reviewData.rating,
        comment: reviewData.comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingReview.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating review:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } else {
    // Create new review
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  }
};

/**
 * Delete a review
 * @param reviewId Review ID
 * @param userId User ID (for security verification)
 */
export const deleteReview = async (reviewId: string, userId: string): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId); // Security check
    
  if (error) {
    console.error('Error deleting review:', error);
    return { success: false, error };
  }
  
  return { success: true, error: null };
};

/**
 * Get average rating for a course
 * @param courseId Course ID
 */
export const getCourseAverageRating = async (courseId: string): Promise<{ rating: number; count: number; error: any }> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', courseId);
    
  if (error) {
    console.error('Error fetching course ratings:', error);
    return { rating: 0, count: 0, error };
  }
  
  if (!data || data.length === 0) {
    return { rating: 0, count: 0, error: null };
  }
  
  // Calculate average rating
  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / data.length;
  
  return { rating: parseFloat(average.toFixed(1)), count: data.length, error: null };
}; 