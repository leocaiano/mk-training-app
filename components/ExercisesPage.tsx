import React, { useState } from 'react'
import { 
  Search, Plus, Filter, Grid, List, Edit, Trash2, 
  Play, Eye, Dumbbell, Target, Clock, Zap, Loader2 
} from 'lucide-react'
import { useExercises, useExerciseActions, useToast } from '../hooks/useSupabase'
import { Exercise, MUSCLE_GROUPS } from '../lib/types'

// Modal Component para Criar/Editar Exercício
const ExerciseModal = ({ 
  isOpen, 
  onClose, 
  exercise, 
  onSuccess 
}: {
  isOpen: boolean
  onClose: () => void
  exercise?: Exercise | null
  onSuccess: () => void
}) => {
  const { createExercise, updateExercise, loading } = useExerciseActions()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    muscle_group: exercise?.muscle_group || 'Peito',
    level: exercise?.level || 'Iniciante',
    equipment: exercise?.equipment || '',
    description: exercise?.description || '',
    execution_instructions: exercise?.execution_instructions || '',
    video_url: exercise?.video_url || '',
    tags: exercise?.tags?.join(', ') || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.muscle_group.trim()) newErrors.muscle_group = 'Grupo muscular é obrigatório'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const exerciseData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        active: true
      }

      if (exercise) {
        await updateExercise(exercise.id, exerciseData)
        showToast('Exercício atualizado com sucesso!', 'success')
      } else {
        await createExercise(exerciseData)
        showToast('Exercício criado com sucesso!', 'success')
      }

      onSuccess()
      onClose()
    } catch (error) {
      showToast('Erro ao salvar exercício', 'error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {exercise ? 'Editar Exercício' : 'Novo Exercício'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Exercício *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Supino Reto"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grupo Muscular *
              </label>
              <select
                value={formData.muscle_group}
                onChange={(e) => setFormData(prev => ({ ...prev, muscle_group: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              >
                {MUSCLE_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nível
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipamento
              </label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                placeholder="Ex: Barra, Halteres, Máquina"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL do Vídeo (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição Breve
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="Descrição resumida do exercício..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instruções de Execução
            </label>
            <textarea
              value={formData.execution_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, execution_instructions: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="Passo a passo detalhado da execução do exercício..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="massa, força, básico, compostos"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{exercise ? 'Salvar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente de Card do Exercício
const ExerciseCard = ({ 
  exercise, 
  onEdit, 
  onDelete 
}: { 
  exercise: Exercise
  onEdit: (exercise: Exercise) => void
  onDelete: (exercise: Exercise) => void
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const levelColors = {
    'Iniciante': 'bg-green-100 text-green-800',
    'Intermediário': 'bg-yellow-100 text-yellow-800',
    'Avançado': 'bg-red-100 text-red-800'
  }

  const muscleGroupIcons = {
    'Peito': '💪',
    'Costas': '🏋️',
    'Ombros': '🔥',
    'Bíceps': '💪',
    'Tríceps': '🔥',
    'Pernas': '🦵',
    'Glúteos': '🍑',
    'Abdômen': '🏆',
    'Cardio': '❤️'
  }

  return (
    <div className="bg-white dark:bg-slate-600 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {muscleGroupIcons[exercise.muscle_group as keyof typeof muscleGroupIcons] || '🏋️'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.muscle_group}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {exercise.video_url && (
            <button 
              onClick={() => window.open(exercise.video_url, '_blank')}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              title="Ver Vídeo"
            >
              <Play className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => onEdit(exercise)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(exercise)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 text-xs rounded-full ${levelColors[exercise.level as keyof typeof levelColors]}`}>
          {exercise.level}
        </span>
        {exercise.equipment && (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {exercise.equipment}
          </span>
        )}
        {exercise.tags?.map((tag, index) => (
          <span key={index} className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
            {tag}
          </span>
        ))}
      </div>

      {exercise.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {exercise.description}
        </p>
      )}

      {exercise.execution_instructions && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 mb-2"
          >
            <Eye className="h-4 w-4" />
            <span>{showDetails ? 'Ocultar' : 'Ver'} Instruções</span>
          </button>
          
          {showDetails && (
            <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {exercise.execution_instructions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Componente Principal da Página
export default function ExercisesPage() {
  const { 
    exercises, 
    muscleGroups, 
    filterGroup, 
    setFilterGroup, 
    loading, 
    error, 
    refetch 
  } = useExercises()
  
  const { deleteExercise } = useExerciseActions()
  const { showToast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('Todos')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showModal, setShowModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  // Filtrar exercícios
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscle_group.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'Todos' || exercise.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setShowModal(true)
  }

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (!window.confirm(`Tem certeza que deseja deletar o exercício "${exercise.name}"?`)) {
      return
    }

    try {
      await deleteExercise(exercise.id)
      showToast('Exercício deletado com sucesso!', 'success')
      refetch()
    } catch (error) {
      showToast('Erro ao deletar exercício', 'error')
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingExercise(null)
  }

  const handleModalSuccess = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Carregando exercícios...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erro ao carregar exercícios: {error}</p>
        <button 
          onClick={refetch}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Biblioteca de Exercícios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus exercícios e organize por grupos musculares
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Exercício</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Busca */}
          <div className="relative lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white"
            >
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white"
            >
              <option value="Todos">Todos os Níveis</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{exercises.length}</p>
            </div>
            <Dumbbell className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grupos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{muscleGroups.length - 1}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Com Vídeo</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {exercises.filter(e => e.video_url).length}
              </p>
            </div>
            <Play className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtrados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredExercises.length}</p>
            </div>
            <Filter className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Lista de Exercícios */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum exercício encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterGroup !== 'Todos' || selectedLevel !== 'Todos' 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece adicionando seu primeiro exercício'
            }
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Adicionar Exercício
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={handleEditExercise}
              onDelete={handleDeleteExercise}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ExerciseModal
        isOpen={showModal}
        onClose={handleModalClose}
        exercise={editingExercise}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
