import React, { useState } from 'react';
import { Plus, Calendar, Scale, Ruler, TrendingUp, X, Save, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAssessments } from '../hooks/useSupabase';
import { Assessment, AssessmentFormData } from '../lib/types';

interface AssessmentPageProps {
  selectedStudentId: string;
  selectedStudentName: string;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ 
  selectedStudentId, 
  selectedStudentName 
}) => {
  const { assessments, loading, error, createAssessment, updateAssessment, deleteAssessment } = useAssessments(selectedStudentId);
  const [showModal, setShowModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    student_id: selectedStudentId,
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    body_fat: 0,
    muscle_mass: 0,
    measurements: {
      chest: 0,
      waist: 0,
      hip: 0,
      arm: 0,
      thigh: 0
    },
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Prepare chart data
  const chartData = assessments.map(assessment => ({
    date: new Date(assessment.date).toLocaleDateString('pt-BR'),
    weight: assessment.weight,
    bodyFat: assessment.body_fat,
    muscleMass: assessment.muscle_mass
  })).reverse();

  const resetForm = () => {
    setFormData({
      student_id: selectedStudentId,
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      body_fat: 0,
      muscle_mass: 0,
      measurements: {
        chest: 0,
        waist: 0,
        hip: 0,
        arm: 0,
        thigh: 0
      },
      notes: ''
    });
    setFormErrors({});
    setEditingAssessment(null);
  };

  const openModal = (assessment?: Assessment) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setFormData({
        student_id: assessment.student_id,
        date: assessment.date,
        weight: assessment.weight,
        body_fat: assessment.body_fat,
        muscle_mass: assessment.muscle_mass,
        measurements: assessment.measurements,
        notes: assessment.notes
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = (): boolean => {
    const errors: any = {};

    if (!formData.date) {
      errors.date = 'Data é obrigatória';
    }

    if (formData.weight <= 0) {
      errors.weight = 'Peso deve ser maior que 0';
    }

    if (formData.body_fat < 0 || formData.body_fat > 100) {
      errors.body_fat = 'Percentual de gordura deve estar entre 0 e 100';
    }

    if (formData.muscle_mass < 0) {
      errors.muscle_mass = 'Massa muscular deve ser maior ou igual a 0';
    }

    // Validate measurements
    const measurementErrors: any = {};
    Object.entries(formData.measurements).forEach(([key, value]) => {
      if (value < 0) {
        measurementErrors[key] = 'Medida deve ser maior ou igual a 0';
      }
    });

    if (Object.keys(measurementErrors).length > 0) {
      errors.measurements = measurementErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (editingAssessment) {
        await updateAssessment(editingAssessment.id, formData);
      } else {
        await createAssessment(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assessment: Assessment) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await deleteAssessment(assessment.id);
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('measurements.')) {
      const measurementKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementKey]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear errors
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const getLastAssessment = () => {
    return assessments[0] || null;
  };

  const getProgressSummary = () => {
    if (assessments.length < 2) return null;
    
    const latest = assessments[0];
    const previous = assessments[1];
    
    return {
      weight: latest.weight - previous.weight,
      bodyFat: latest.body_fat - previous.body_fat,
      muscleMass: latest.muscle_mass - previous.muscle_mass
    };
  };

  const progress = getProgressSummary();
  const lastAssessment = getLastAssessment();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
