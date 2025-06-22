import { useState, useEffect } from 'react';
import { 
  Student, 
  Exercise, 
  WorkoutPlan, 
  Assessment, 
  ProgressPhoto,
  StudentFormData,
  ExerciseFormData,
  AssessmentFormData
} from '../lib/types';
import { 
  studentsService, 
  exercisesService, 
  workoutPlansService, 
  assessmentsService,
  progressPhotosService
} from '../lib/services';

// Students Hook
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunas');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: StudentFormData) => {
    try {
      const newStudent = await studentsService.create(studentData);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar aluna');
      throw err;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      const updatedStudent = await studentsService.update(id, studentData);
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return updatedStudent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar aluna');
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentsService.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar aluna');
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  };
}

// Exercises Hook
export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exercisesService.getAll();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar exercícios');
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (exerciseData: ExerciseFormData) => {
    try {
      const newExercise = await exercisesService.create(exerciseData);
      setExercises(prev => [...prev, newExercise]);
      return newExercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar exercício');
      throw err;
    }
  };

  const updateExercise = async (id: string, exerciseData: Partial<Exercise>) => {
    try {
      const updatedExercise = await exercisesService.update(id, exerciseData);
      setExercises(prev => prev.map(e => e.id === id ? updatedExercise : e));
      return updatedExercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar exercício');
      throw err;
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      await exercisesService.delete(id);
      setExercises(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar exercício');
      throw err;
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise
  };
}

// Assessments Hook
export function useAssessments(studentId: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentsService.getByStudentId(studentId);
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (assessmentData: AssessmentFormData) => {
    try {
      const newAssessment = await assessmentsService.create(assessmentData);
      setAssessments(prev => [newAssessment, ...prev]);
      return newAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar avaliação');
      throw err;
    }
  };

  const updateAssessment = async (id: string, assessmentData: Partial<Assessment>) => {
    try {
      const updatedAssessment = await assessmentsService.update(id, assessmentData);
      setAssessments(prev => prev.map(a => a.id === id ? updatedAssessment : a));
      return updatedAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar avaliação');
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      await assessmentsService.delete(id);
      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar avaliação');
      throw err;
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [studentId]);

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment
  };
}

// Progress Photos Hook
export function useProgressPhotos(studentId: string) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await progressPhotosService.getByStudentId(studentId);
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, type: 'front' | 'back' | 'side') => {
    try {
      const newPhoto = await progressPhotosService.upload(file, studentId, type);
      setPhotos(prev => [newPhoto, ...prev]);
      return newPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da foto');
      throw err;
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      await progressPhotosService.delete(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar foto');
      throw err;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [studentId]);

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos,
    uploadPhoto,
    deletePhoto
  };
}

// Workout Plans Hook
export function useWorkoutPlans(studentId: string) {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutPlans = async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await workoutPlansService.getByStudentId(studentId);
      setWorkoutPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos de treino');
    } finally {
      setLoading(false);
    }
  };

  const createWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPlan = await workoutPlansService.create(planData);
      setWorkoutPlans(prev => [newPlan, ...prev]);
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar plano de treino');
      throw err;
    }
  };

  const updateWorkoutPlan = async (id: string, planData: Partial<WorkoutPlan>) => {
    try {
      const updatedPlan = await workoutPlansService.update(id, planData);
      setWorkoutPlans(prev => prev.map(p => p.id === id ? updatedPlan : p));
      return updatedPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar plano de treino');
      throw err;
    }
  };

  const deleteWorkoutPlan = async (id: string) => {
    try {
      await workoutPlansService.delete(id);
      setWorkoutPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar plano de treino');
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, [studentId]);

  return {
    workoutPlans,
    loading,
    error,
    refetch: fetchWorkoutPlans,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan
  };
}
