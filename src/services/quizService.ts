import { supabase } from '@/lib/supabase';

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  pass_percentage: number;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  position: number;
  answers?: Answer[];
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  started_at: string;
  completed_at?: string;
}

export interface QuizSubmission {
  quiz_id: string;
  answers: {
    question_id: string;
    answer_id?: string;
    text_answer?: string;
  }[];
}

/**
 * Get a quiz by lesson ID
 * @param lessonId Lesson ID
 */
export const getQuizByLesson = async (lessonId: string): Promise<{ data: Quiz | null; error: any }> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching quiz:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Get a quiz with all questions and answers
 * @param quizId Quiz ID
 */
export const getQuizWithQuestions = async (quizId: string): Promise<{ data: Quiz | null; error: any }> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions:questions(
        *,
        answers:answers(*)
      )
    `)
    .eq('id', quizId)
    .single();
    
  if (error) {
    console.error('Error fetching quiz with questions:', error);
    return { data: null, error };
  }
  
  // Sort questions by position
  if (data.questions) {
    data.questions.sort((a: Question, b: Question) => a.position - b.position);
    
    // Sort answers within each question by position
    data.questions.forEach(question => {
      if (question.answers) {
        question.answers.sort((a: Answer, b: Answer) => a.position - b.position);
      }
    });
  }

  return { data, error: null };
};

/**
 * Create a quiz attempt
 * @param userId User ID
 * @param quizId Quiz ID
 */
export const startQuizAttempt = async (userId: string, quizId: string): Promise<{ data: QuizAttempt | null; error: any }> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([
      {
        user_id: userId,
        quiz_id: quizId,
        score: 0,
        passed: false,
        started_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
    
  if (error) {
    console.error('Error starting quiz attempt:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Submit a quiz attempt and grade it
 * @param attemptId Attempt ID
 * @param submission Quiz submission with answers
 */
export const submitQuizAttempt = async (
  attemptId: string, 
  userId: string,
  submission: QuizSubmission
): Promise<{ score: number; passed: boolean; error: any }> => {
  try {
    // Get the quiz with questions and answers
    const { data: quiz, error: quizError } = await getQuizWithQuestions(submission.quiz_id);
    
    if (quizError || !quiz) {
      console.error('Error fetching quiz for grading:', quizError);
      return { score: 0, passed: false, error: quizError || new Error('Quiz not found') };
    }
    
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = quiz.questions?.length || 0;
    
    if (totalQuestions === 0) {
      return { score: 0, passed: false, error: new Error('Quiz has no questions') };
    }
    
    // For each submission answer, check if it's correct
    for (const submittedAnswer of submission.answers) {
      const question = quiz.questions?.find(q => q.id === submittedAnswer.question_id);
      
      if (!question) continue;
      
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        // Check if the selected answer is correct
        const selectedAnswer = question.answers?.find(a => a.id === submittedAnswer.answer_id);
        if (selectedAnswer && selectedAnswer.is_correct) {
          correctAnswers++;
        }
      } else if (question.type === 'short_answer' && submittedAnswer.text_answer) {
        // For short answers, check against all correct answers
        const correctTextAnswers = question.answers?.filter(a => a.is_correct) || [];
        
        // Simple exact match for now (could be enhanced with more sophisticated matching)
        if (correctTextAnswers.some(a => 
          a.answer.toLowerCase() === submittedAnswer.text_answer?.toLowerCase()
        )) {
          correctAnswers++;
        }
      }
    }
    
    // Calculate score percentage
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.pass_percentage;
    
    // Update the attempt with the final score
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        score: scorePercentage,
        passed,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .eq('user_id', userId); // Security check
      
    if (updateError) {
      console.error('Error updating quiz attempt:', updateError);
      return { score: scorePercentage, passed, error: updateError };
    }
    
    return { score: scorePercentage, passed, error: null };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return { score: 0, passed: false, error };
  }
};

/**
 * Get quiz attempts for a user
 * @param userId User ID
 * @param quizId Optional quiz ID to filter by
 */
export const getUserQuizAttempts = async (
  userId: string, 
  quizId?: string
): Promise<{ data: QuizAttempt[] | null; error: any }> => {
  let query = supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId);
    
  if (quizId) {
    query = query.eq('quiz_id', quizId);
  }
  
  const { data, error } = await query.order('started_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching quiz attempts:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Get a quiz attempt by ID
 * @param attemptId Attempt ID
 * @param userId User ID (for security verification)
 */
export const getQuizAttempt = async (
  attemptId: string,
  userId: string
): Promise<{ data: QuizAttempt | null; error: any }> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', userId) // Security check
    .single();
    
  if (error) {
    console.error('Error fetching quiz attempt:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Create a new quiz
 * @param quizData Quiz data
 */
export const createQuiz = async (
  quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Quiz | null; error: any }> => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert([quizData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating quiz:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Create a new question for a quiz
 * @param questionData Question data
 */
export const createQuestion = async (
  questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Question | null; error: any }> => {
  const { data, error } = await supabase
    .from('questions')
    .insert([questionData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating question:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Create new answers for a question
 * @param answers Array of answer data
 */
export const createAnswers = async (
  answers: Omit<Answer, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ data: Answer[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('answers')
    .insert(answers)
    .select();
    
  if (error) {
    console.error('Error creating answers:', error);
    return { data: null, error };
  }

  return { data, error: null };
}; 