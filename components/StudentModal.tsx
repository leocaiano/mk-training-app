import React, { useState, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { Student, StudentFormData, STUDENT_LEVELS, SERVICE_TYPES } from '../lib/types'
import { useStudentActions } from '../hooks/useSupabase'

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  student?: Student | null
  onSuccess: () => void
}

export default function StudentModal({ isOpen, onClose, student, onSuccess }: StudentModalProps) {
  const { createStudent, updateStudent, loading } = useStudentActions()
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    age: undefined,
    level: 'Iniciante',
    weight: undefined,
    height: undefined,
    goals: [],
    observations: '',
    service_type: 'Planilha',
    training_location: '',
    monthly_fee: undefined,
    has_portal_access: false
  })

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({})
  const [photoPreview, setPhotoPreview] = useState<string>('')

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        age: student.age,
        level: student.level,
        weight: student.weight,
        height: student.height,
        goals: student.goals || [],
        observations: student.observations || '',
        service_type: student.service_type,
        training_location: student.training_location || '',
        monthly_fee: student.monthly_fee,
        has_portal_access: student.has_portal_access
      })
      setPhotoPreview(student.photo || '')
    } else {
      // Reset form for new student
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: undefined,
        level: 'Iniciante',
        weight: undefined,
        height: undefined,
        goals: [],
        observations: '',
        service_type: 'Planilha',
        training_location: '',
        monthly_fee: undefined,
        has_portal_access: false
      })
      setPhotoPreview('')
    }
    setErrors({})
  }, [student, isOpen])

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleGoalToggle = (goal: string) => {
    const currentGoals = formData.goals || []
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal]
    
    handleInputChange('goals', updatedGoals)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.age && (formData.age < 12 || formData.age > 100)) {
      newErrors.age = 'Idade deve estar entre 12 e 100 anos'
    }

    if (formData.weight && (formData.weight < 30 || formData.weight > 300)) {
      newErrors.weight = 'Peso deve estar entre 30 e 300 kg'
    }

    if (formData.height && (formData.height < 100 || formData.height > 250)) {
      newErrors.height = 'Altura deve estar entre 100 e 250 cm'
    }

    if (formData.monthly_fee && formData.monthly_fee < 0) {
      newErrors.monthly_fee = 'Valor da mensalidade deve ser positivo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (student) {
        // Editando aluna existente
        await updateStudent(student.id, formData)
      } else {
        // Criando nova aluna
        await createStudent({
          ...formData,
          active: true,
          payment_status: 'Em dia'
        })
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar aluna:', error)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const availableGoals = [
    'Perda de peso',
    'Ganho de massa muscular',
    'Fortalecimento',
    'Condicionamento geral',
    'Flexibilidade',
    'Resistência cardiovascular',
    'Reabilitação',
    'Preparação para competição'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {student ? 'Editar Aluna' : 'Nova Aluna'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={photoPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=random`}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-rose-500 text-white rounded-full cursor-pointer hover:bg-rose-600">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clique no ícone para alterar a foto
            </p>
          </div>

          {/* Informações Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
                placeholder="+55 (11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Idade
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="25"
                min="12"
                max="100"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Nível e Tipo de Serviço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nível de Condicionamento
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value as Student['level'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              >
                {STUDENT_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Serviço
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => handleInputChange('service_type', e.target.value as Student['service_type'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dados Físicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.weight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="65.5"
                min="30"
                max="300"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Altura (cm)
              </label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.height ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="165"
                min="100"
                max="250"
              />
              {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mensalidade (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_fee || ''}
                onChange={(e) => handleInputChange('monthly_fee', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white ${
                  errors.monthly_fee ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="195.00"
                min="0"
              />
              {errors.monthly_fee && <p className="text-red-500 text-xs mt-1">{errors.monthly_fee}</p>}
            </div>
          </div>

          {/* Local de Treinamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Local de Treinamento
            </label>
            <input
              type="text"
              value={formData.training_location}
              onChange={(e) => handleInputChange('training_location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="Ex: Academia XYZ, Casa, Parque..."
            />
          </div>

          {/* Objetivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Objetivos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableGoals.map(goal => (
                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.goals || []).includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                    className="text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-600 dark:text-white"
              placeholder="Observações importantes sobre a aluna..."
            />
          </div>

          {/* Acesso ao Portal */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="portal-access"
              checked={formData.has_portal_access}
              onChange={(e) => handleInputChange('has_portal_access', e.target.checked)}
              className="text-rose-500 focus:ring-rose-500"
            />
            <label htmlFor="portal-access" className="text-sm text-gray-700 dark:text-gray-300">
              Criar acesso ao portal da aluna
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{student ? 'Salvar Alterações' : 'Criar Aluna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
