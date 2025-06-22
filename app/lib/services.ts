import { createClient } from '@supabase/supabase-js';
import { Student, Exercise, WorkoutPlan, Assessment, ProgressPhoto } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Usuário não autenticado');
  }
  return user;
};

// Students Services
export const studentsService = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Student> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ ...student, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Exercises Services
export const exercisesService = {
  async getAll(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('muscle_group', muscleGroup)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(exercise: Omit<Exercise, 'id' | 'created_at' | 'user_id'>): Promise<Exercise> {
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('exercises')
      .insert([{ ...exercise, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .update(exercise)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Workout Plans Services
export const workoutPlansService = {
  async getByStudentId(studentId: string): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert([workoutPlan])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, workoutPlan: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .update({ ...workoutPlan, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Assessments Services
export const assessmentsService = {
  async getByStudentId(studentId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(assessment: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, assessment: Partial<Assessment>): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .update(assessment)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Progress Photos Services
export const progressPhotosService = {
  async getByStudentId(studentId: string): Promise<ProgressPhoto[]> {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async upload(file: File, studentId: string, type: 'front' | 'back' | 'side'): Promise<ProgressPhoto> {
    const user = await getCurrentUser();
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName);

    const progressPhoto = {
      student_id: studentId,
      url: publicUrl,
      date: new Date().toISOString().split('T')[0],
      type
    };

    const { data, error } = await supabase
      .from('progress_photos')
      .insert([progressPhoto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    // First get the photo to delete the file from storage
    const { data: photo, error: fetchError } = await supabase
      .from('progress_photos')
      .select('url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Extract file path from URL
    if (photo?.url) {
      const urlParts = photo.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const studentId = urlParts[urlParts.length - 2];
      const filePath = `${studentId}/${fileName}`;

      // Delete from storage
      await supabase.storage
        .from('progress-photos')
        .remove([filePath]);
    }

    // Delete from database
    const { error } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
