export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export const calculateIMC = (weight: number, height: number): number => {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export const getIMCStatus = (imc: number): string => {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Normal'
  if (imc < 30) return 'Sobrepeso'
  return 'Obesidade'
}

export const getIMCColor = (imc: number): string => {
  if (imc < 18.5) return 'text-blue-600'
  if (imc < 25) return 'text-green-600'
  if (imc < 30) return 'text-yellow-600'
  return 'text-red-600'
}
