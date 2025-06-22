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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            Avaliações Físicas
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <User className="w-4 h-4" />
            {selectedStudentName}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Avaliação
        </button>
      </div>

      {/* Summary Cards */}
      {lastAssessment && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Scale className="w-4 h-4" />
              <span className="text-sm font-medium">Peso Atual</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {lastAssessment.weight} kg
            </div>
            {progress && (
              <div className={`text-sm mt-1 ${progress.weight >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {progress.weight >= 0 ? '+' : ''}{progress.weight.toFixed(1)} kg
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Gordura Corporal</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {lastAssessment.body_fat}%
            </div>
            {progress && (
              <div className={`text-sm mt-1 ${progress.bodyFat <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {progress.bodyFat >= 0 ? '+' : ''}{progress.bodyFat.toFixed(1)}%
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Ruler className="w-4 h-4" />
              <span className="text-sm font-medium">Massa Muscular</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {lastAssessment.muscle_mass} kg
            </div>
            {progress && (
              <div className={`text-sm mt-1 ${progress.muscleMass >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {progress.muscleMass >= 0 ? '+' : ''}{progress.muscleMass.toFixed(1)} kg
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Última Avaliação</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {new Date(lastAssessment.date).toLocaleDateString('pt-BR')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {assessments.length} avaliação{assessments.length !== 1 ? 'ões' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {chartData.length > 1 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Peso (kg)"
                />
                <Line 
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Gordura (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="muscleMass" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Massa Muscular (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Assessments List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Avaliações</h3>
        </div>

        {assessments.length === 0 ? (
          <div className="p-8 text-center">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação registrada</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Criar primeira avaliação
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {new Date(assessment.date).toLocaleDateString('pt-BR')}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date(assessment.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Peso:</span>
                        <span className="ml-2 font-medium">{assessment.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gordura:</span>
                        <span className="ml-2 font-medium">{assessment.body_fat}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Massa Muscular:</span>
                        <span className="ml-2 font-medium">{assessment.muscle_mass} kg</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-gray-600">Peito:</span>
                        <span className="ml-2 font-medium">{assessment.measurements.chest} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cintura:</span>
                        <span className="ml-2 font-medium">{assessment.measurements.waist} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quadril:</span>
                        <span className="ml-2 font-medium">{assessment.measurements.hip} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Braço:</span>
                        <span className="ml-2 font-medium">{assessment.measurements.arm} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Coxa:</span>
                        <span className="ml-2 font-medium">{assessment.measurements.thigh} cm</span>
                      </div>
                    </div>

                    {assessment.notes && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-600">Observações:</span>
                        <p className="mt-1 text-gray-700">{assessment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(assessment)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(assessment)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAssessment ? 'Editar Avaliação' : 'Nova Avaliação'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Avaliação *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="65.0"
                  />
                  {formErrors.weight && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.weight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gordura Corporal (%)
                  </label>
                  <input
                    type="number"
                    name="body_fat"
                    value={formData.body_fat || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.body_fat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="20.5"
                  />
                  {formErrors.body_fat && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.body_fat}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Massa Muscular (kg)
                  </label>
                  <input
                    type="number"
                    name="muscle_mass"
                    value={formData.muscle_mass || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.muscle_mass ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="45.0"
                  />
                  {formErrors.muscle_mass && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.muscle_mass}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medidas Corporais (cm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peito
                    </label>
                    <input
                      type="number"
                      name="measurements.chest"
                      value={formData.measurements.chest || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="90"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cintura
                    </label>
                    <input
                      type="number"
                      name="measurements.waist"
                      value={formData.measurements.waist || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quadril
                    </label>
                    <input
                      type="number"
                      name="measurements.hip"
                      value={formData.measurements.hip || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="95"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Braço
                    </label>
                    <input
                      type="number"
                      name="measurements.arm"
                      value={formData.measurements.arm || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coxa
                    </label>
                    <input
                      type="number"
                      name="measurements.thigh"
                      value={formData.measurements.thigh || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="55"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observações sobre a avaliação..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
