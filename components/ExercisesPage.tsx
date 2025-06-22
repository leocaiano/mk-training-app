import React, { useState } from 'react';
import { Plus, Search, Filter, Dumbbell, Edit, Trash2, X, Save } from 'lucide-react';
import { useExercises } from '../hooks/useSupabase';
import { Exercise, ExerciseFormData } from '../lib/types';

const ExercisesPage: React.FC = () => {
  const { exercises, loading, error, createExercise, updateExercise, deleteExercise } = useExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    muscle_group: '',
    equipment: '',
    instructions: '',
    difficulty: 'beginner'
  });
  const [formErrors, setFormErrors] = useState<Partial<ExerciseFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // Get unique muscle groups for filter
  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscle_group))).sort();

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscle_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = !filterMuscleGroup || exercise.muscle_group === filterMuscleGroup;
    const matchesDifficulty = !filterDifficulty || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesMuscleGroup && matchesDifficulty;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      muscle_group: '',
      equipment: '',
      instructions: '',
      difficulty: 'beginner'
    });
    setFormErrors({});
    setEditingExercise(null);
  };

  const openModal = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      setFormData({
        name: exercise.name,
        muscle_group: exercise.muscle_group,
        equipment: exercise.equipment,
        instructions: exercise.instructions,
        difficulty: exercise.difficulty
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
    const errors: Partial<ExerciseFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.muscle_group.trim()) {
      errors.muscle_group = 'Grupo muscular é obrigatório';
    }

    if (!formData.equipment.trim()) {
      errors.equipment = 'Equipamento é obrigatório';
    }

    if (!formData.instructions.trim()) {
      errors.instructions = 'Instruções são obrigatórias';
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
      if (editingExercise) {
        await updateExercise(editingExercise.id, formData);
      } else {
        await createExercise(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (exercise: Exercise) => {
    if (window.confirm(`Tem certeza que deseja excluir o exercício "${exercise.name}"?`)) {
      try {
        await deleteExercise(exercise.id);
      } catch (error) {
        console.error('Erro ao excluir exercício:', error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof ExerciseFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return difficulty;
    }
  };

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
            <Dumbbell className="w-6 h-6 text-blue-600" />
            Exercícios
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie o banco de exercícios disponíveis
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Exercício
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterMuscleGroup}
            onChange={(e) => setFilterMuscleGroup(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os grupos musculares</option>
            {muscleGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as dificuldades</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <p className="text-gray-600">
            {filteredExercises.length} exercício{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center">
            <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum exercício encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {getDifficultyLabel(exercise.difficulty)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Grupo muscular:</span> {exercise.muscle_group}
                      </div>
                      <div>
                        <span className="font-medium">Equipamento:</span> {exercise.equipment}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Instruções:</span>
                      <p className="mt-1">{exercise.instructions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(exercise)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exercise)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingExercise ? 'Editar Exercício' : 'Novo Exercício'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Exercício *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Supino reto"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupo Muscular *
                  </label>
                  <input
                    type="text"
                    name="muscle_group"
                    value={formData.muscle_group}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.muscle_group ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Peito"
                  />
                  {formErrors.muscle_group && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.muscle_group}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipamento *
                  </label>
                  <input
                    type="text"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.equipment ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Barra"
                  />
                  {formErrors.equipment && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.equipment}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificuldade
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instruções *
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.instructions ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva como executar o exercício corretamente..."
                />
                {formErrors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.instructions}</p>
                )}
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

export default ExercisesPage;
