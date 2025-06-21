export interface Student {
  id: number
  name: string
  email: string
  phone: string
  age: number
  photo: string
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Atleta'
  weight: number
  height: number
  imc: number
  imcStatus: string
  goals: string[]
  observations: string
  workouts: string
  active: boolean
  hasPortalAccess: boolean
  lastLogin: string
  paymentStatus: 'Em dia' | 'Pendente' | 'Atrasado'
  created_at?: string
  updated_at?: string
}

export interface Exercise {
  id: number
  name: string
  group: string
  level: string
  equipment: string
  description: string
  videoUrl?: string
  created_at?: string
  updated_at?: string
}

export interface AdvancedMethod {
  id: number
  name: string
  category: string
  icon: string
  description: string
  videoUrl?: string
  created_at?: string
  updated_at?: string
}

export interface WorkoutTemplate {
  id: number
  name: string
  category: string
  difficulty: string
  duration: string
  exercises: number
  tags: string[]
  created_at?: string
  updated_at?: string
}
