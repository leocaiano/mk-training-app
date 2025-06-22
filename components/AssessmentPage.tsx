import React, { useState, useEffect } from 'react'
import { 
  User, Plus, TrendingUp, Camera, Calendar, 
  Ruler, Weight, Activity, BarChart3, 
  Upload, Download, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStudents } from '../hooks/useSupabase'
import { Student, PhysicalAssessment } from '../lib/types'

// Hook simulado para avaliações (você implementará com Supabase)
const useAssessments = (studentId: string | null) => {
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([])
  const [loading, setLoading] = useState(false)

  // Dados simulados para demonstração
  useEffect(() => {
    if (studentId) {
      setAssessments([
        {
          id: '1',
          student_id: studentId,
          assessment_date: '2024-01-15',
          weight: 68.5,
          height: 165,
          neck: 32.0,
          chest: 88.0,
          waist: 72.0,
          hip: 95.0,
          body_fat_percentage: 22.5,
          notes: 'Primeira avaliação da aluna'
        },
        {
          id: '2',
          student_id: studentId,
          assessment_date: '2024-02-15',
          weight: 67.2,
          height: 165,
          neck: 31.5,
          chest: 87.0,
          waist: 70.5,
          hip: 94.0,
          body_fat_percentage: 21.2,
          notes: 'Boa evolução no primeiro mês'
        },
        {
          id: '3',
          student_id: studentId,
          assessment_date: '2024-03-15',
          weight: 65.8,
          height: 165,
          neck: 31.0,
          chest: 86.5,
          waist: 69.0,
          hip: 93.5,
          body_fat_percentage: 19.8,
          notes: 'Excelente progresso'
        }
      ])
    }
  }, [studentId])

  return { assessments, loading }
}

// Componente para o Formulário de Nova Avaliação
const AssessmentForm = ({ 
  student, 
  onSave, 
  onCancel 
}: { 
  student: Student
  onSave: (data: any) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    assessment_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: student.height?.toString() || '',
    
    // Medidas Corporais
    neck: '',
    chest: '',
    left_arm: '',
    right_arm: '',
    left_forearm: '',
    right_forearm: '',
    waist: '',
    hip: '',
    left_thigh: '',
    right_thigh: '',
    left_calf: '',
    right_calf: '',
    
    // Dobras Cutâneas
    triceps_fold: '',
    subscapular_fold: '',
    chest_fold: '',
    midaxillary_fold: '',
    abdominal_fold: '',
    suprailiac_fold: '',
    thigh_fold: '',
    body_fat_percentage: '',
    
    // Bioimpedância
    fat_mass: '',
    lean_mass: '',
    skeletal_muscle_mass: '',
    total_body_water: '',
    visceral_fat: '',
    basal_metabolic_rate: '',
    
    notes: ''
  })

  const [activeTab, setActiveTab] = useState('basic')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const calculateIMC = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    if (weight && height) {
      return (weight / Math.pow(height / 100, 2)).toFixed(1)
    }
    return '-'
  }

  const tabs = [
    { id: 'basic', label: 'Dados Básicos', icon: User },
    { id: 'measures', label: 'Medidas', icon: Ruler },
    { id: 'folds', label: 'Dobras', icon: Activity },
    { id: 'bioimpedance', label: 'Bioimpedância', icon: BarChart3 }
  ]

  return (
    <div className="bg-white dark:bg-slate-600 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Nova Avaliação - {student.name}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Salvar Avaliação
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Dados Básicos */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data da Avaliação
                </label>
                <input
                  type="date"
                  value={formData.assessment_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessment_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                  placeholder="65.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                  placeholder="165"
                />
              </div>
            </div>

            {/* IMC Calculado */}
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                IMC Calculado
              </h3>
              <div className="text-3xl font-bold text-rose-500">
                {calculateIMC()}
                {calculateIMC() !== '-' && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    kg/m²
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observações Gerais
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                placeholder="Observações sobre a avaliação..."
              />
            </div>
          </div>
        )}

        {/* Medidas Corporais */}
        {activeTab === 'measures' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pescoço (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.neck}
                  onChange={(e) => setFormData(prev => ({ ...prev, neck: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peito (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chest}
                  onChange={(e) => setFormData(prev => ({ ...prev, chest: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cintura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => setFormData(prev => ({ ...prev, waist: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quadril (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hip}
                  onChange={(e) => setFormData(prev => ({ ...prev, hip: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Braço Esq. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.left_arm}
                  onChange={(e) => setFormData(prev => ({ ...prev, left_arm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Braço Dir. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.right_arm}
                  onChange={(e) => setFormData(prev => ({ ...prev, right_arm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coxa Esq. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.left_thigh}
                  onChange={(e) => setFormData(prev => ({ ...prev, left_thigh: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coxa Dir. (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.right_thigh}
                  onChange={(e) => setFormData(prev => ({ ...prev, right_thigh: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dobras Cutâneas */}
        {activeTab === 'folds' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tricipital (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.triceps_fold}
                  onChange={(e) => setFormData(prev => ({ ...prev, triceps_fold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subescapular (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.subscapular_fold}
                  onChange={(e) => setFormData(prev => ({ ...prev, subscapular_fold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Abdominal (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.abdominal_fold}
                  onChange={(e) => setFormData(prev => ({ ...prev, abdominal_fold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  % Gordura
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.body_fat_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_fat_percentage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bioimpedância */}
        {activeTab === 'bioimpedance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Massa Gorda (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fat_mass}
                  onChange={(e) => setFormData(prev => ({ ...prev, fat_mass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Massa Magra (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.lean_mass}
                  onChange={(e) => setFormData(prev => ({ ...prev, lean_mass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Massa Muscular (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.skeletal_muscle_mass}
                  onChange={(e) => setFormData(prev => ({ ...prev, skeletal_muscle_mass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Água Corporal (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.total_body_water}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_body_water: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gordura Visceral
                </label>
                <input
                  type="number"
                  value={formData.visceral_fat}
                  onChange={(e) => setFormData(prev => ({ ...prev, visceral_fat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Taxa Metabólica (kcal)
                </label>
                <input
                  type="number"
                  value={formData.basal_metabolic_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, basal_metabolic_rate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// Componente Principal da Página
export default function AssessmentPage() {
  const { students, loading: studentsLoading } = useStudents()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { assessments, loading: assessmentsLoading } = useAssessments(selectedStudent?.id || null)

  // Preparar dados para o gráfico
  const chartData = assessments.map(assessment => ({
    date: new Date(assessment.assessment_date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    peso: assessment.weight,
    gordura: assessment.body_fat_percentage,
    cintura: assessment.waist
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const handleSaveAssessment = (data: any) => {
    console.log('Salvando avaliação:', data)
    // Aqui você implementará a chamada para o Supabase
    setShowForm(false)
  }

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Avaliação Física
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as medidas corporais e evolução das suas alunas
          </p>
        </div>
        {selectedStudent && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Avaliação</span>
          </button>
        )}
      </div>

      {/* Seleção de Aluna */}
      {!selectedStudent && !showForm && (
        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selecione uma Aluna
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-left"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                    alt={student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.level} • {student.service_type}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Nova Avaliação */}
      {showForm && selectedStudent && (
        <AssessmentForm
          student={selectedStudent}
          onSave={handleSaveAssessment}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Dados da Aluna Selecionada */}
      {selectedStudent && !showForm && (
        <>
          {/* Header da Aluna */}
          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <img
                  src={selectedStudent.photo || `https://ui-avatars.com/api/?name=${selectedStudent.name}&background=random`}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedStudent.age} anos • {selectedStudent.level}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    {selectedStudent.weight && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedStudent.weight} kg
                      </span>
                    )}
                    {selectedStudent.height && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedStudent.height} cm
                      </span>
                    )}
                    {selectedStudent.imc && (
                      <span className="text-sm text-green-600">
                        IMC: {selectedStudent.imc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {assessments.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-rose-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Última</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {assessments.length > 0 
                      ? new Date(assessments[assessments.length - 1].assessment_date).toLocaleDateString('pt-BR')
                      : 'Nunca'
                    }
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Evolução</p>
                  <p className="text-lg font-bold text-green-600">
                    {assessments.length >= 2 
                      ? `${(assessments[0].weight! - assessments[assessments.length - 1].weight!).toFixed(1)} kg`
                      : 'N/A'
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">% Gordura</p>
                  <p className="text-lg font-bold text-purple-600">
                    {assessments.length > 0 && assessments[assessments.length - 1].body_fat_percentage
                      ? `${assessments[assessments.length - 1].body_fat_percentage}%`
                      : 'N/A'
                    }
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          {assessments.length > 0 && (
            <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Evolução Temporal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Peso (kg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gordura" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="% Gordura"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cintura" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    name="Cintura (cm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Histórico de Avaliações */}
          <div className="bg-white dark:bg-slate-600 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Histórico de Avaliações
              </h3>
            </div>
            
            {assessments.length === 0 ? (
              <div className="p-6 text-center">
                <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma avaliação encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Faça a primeira avaliação desta aluna
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Primeira Avaliação
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {assessments.map((assessment, index) => (
                    <div key={assessment.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-rose-100 p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-rose-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Avaliação #{assessments.length - index}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(assessment.assessment_date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Peso</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {assessment.weight} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Cintura</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {assessment.waist || '-'} cm
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">% Gordura</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {assessment.body_fat_percentage || '-'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">IMC</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {assessment.weight && assessment.height 
                              ? (assessment.weight / Math.pow(assessment.height / 100, 2)).toFixed(1)
                              : '-'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {assessment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {assessment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
