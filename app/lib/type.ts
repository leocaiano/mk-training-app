export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  height: number;
  weight: number;
  goal: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  instructions: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  student_id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  weight: number;
  rest_time: number;
  notes: string;
  order_index: number;
  exercise?: Exercise;
}

export interface Assessment {
  id: string;
  student_id: string;
  date: string;
  weight: number;
  body_fat: number;
  muscle_mass: number;
  measurements: {
    chest: number;
    waist: number;
    hip: number;
    arm: number;
    thigh: number;
  };
  notes: string;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  student_id: string;
  url: string;
  date: string;
  type: 'front' | 'back' | 'side';
  created_at: string;
}

export type StudentFormData = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
export type ExerciseFormData = Omit<Exercise, 'id' | 'created_at'>;
export type AssessmentFormData = Omit<Assessment, 'id' | 'created_at'>;
