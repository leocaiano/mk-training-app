'use client';

import React, { useState } from 'react';
import { Users, Plus, Search, Dumbbell, Scale, Edit, Trash2, Phone, Mail, Target, Calendar } from 'lucide-react';
import { useStudents } from './hooks/useSupabase';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserMenu } from './components/AuthComponents';
import StudentModal from './components/StudentModal';
import ExercisesPage from './components/ExercisesPage';
import AssessmentPage from './components/AssessmentPage';
import { Student, StudentFormData } from './lib/types';

export default function Home() {
  const { students, loading, error, createStudent, updateStudent, deleteStudent } = useStudents();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exercises' | 'assessments'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleCreateStudent = async (data: StudentFormData) => {
    await createStudent(data);
  };

  const handleUpdateStudent = async (data: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (window.confirm(`Tem certeza que deseja excluir ${student.name}?`)) {
      await deleteStudent(student.id);
      if (selectedStudentId === student.id) {
        setSelectedStudentId('');
      }
    }
  };

  const openModal = (student?: Student) => {
    setEditingStudent(student || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Básico';
      case 'premium':
        return 'Premium';
      case 'vip':
        return 'VIP';
      default:
        return plan;
    }
  };

  // Render different pages based on active tab
  if (activeTab === 'exercises') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with User Menu */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MK Training</h1>
                <p className="text-gray-600 mt-2">Sistema de Gerenciamento de Personal Trainer</p>
              </div>
              <UserMenu />
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Alunas
                </button>
                <button
                  onClick={() => setActiveTab('exercises')}
                  className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
                >
                  <Dumbbell className="w-4 h-4 inline mr-2" />
                  Exercícios
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  disabled={!selectedStudentId}
                  className={`py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm ${!selectedStudentId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Scale className="w-4 h-4 inline mr-2" />
                  Avaliações
                  {!selectedStudentId && <span className="text-xs ml-1">(selecione uma aluna)</span>}
                </button>
              </nav>
            </div>

            <ExercisesPage />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (activeTab === 'assessments' && selectedStudentId && selectedStudent) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with User Menu */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MK Training</h1>
                <p className="text-gray-600 mt-2">Sistema de Gerenciamento de Personal Trainer</p>
              </div>
              <UserMenu />
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Alunas
                </button>
                <button
                  onClick={() => setActiveTab('exercises')}
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                >
                  <Dumbbell className="w-4 h-4 inline mr-2" />
                  Exercícios
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
                >
                  <Scale className="w-4 h-4 inline mr-2" />
                  Avaliações
                </button>
              </nav>
            </div>

            <AssessmentPage 
              selectedStudentId={selectedStudentId} 
              selectedStudentName={selectedStudent.name}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with User Menu */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MK Training</h1>
              <p className="text-gray-600 mt-2">Sistema de Gerenciamento de Personal Trainer</p>
            </div>
            <UserMenu />
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Alunas
              </button>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'exercises'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Dumbbell className="w-4 h-4 inline mr-2" />
                Exercícios
              </button>
              <button
                onClick={() => setActiveTab('assessments')}
                disabled={!selectedStudentId}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assessments' && selectedStudentId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${!selectedStudentId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Scale className="w-4 h-4 inline mr-2" />
                Avaliações
                {!selectedStudentId && <span className="text-xs ml-1">(selecione uma aluna)</span>}
              </button>
            </nav>
          </div>

          {/* Dashboard Content */}
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Alunas</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Plano Premium</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.filter(s => s.plan === 'premium').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Plano VIP</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.filter(s => s.plan === 'vip').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Dumbbell className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Plano Básico</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.filter(s => s.plan === 'basic').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Students Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Lista de Alunas</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Gerencie suas alunas e acompanhe o progresso
                    </p>
                  </div>
                  <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Aluna
                  </button>
                </div>

                {/* Search */}
                <div className="mt-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar alunas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-6 bg-red-50 border-l-4 border-red-400">
                  <p className="text-red-700">Erro: {error}</p>
                </div>
              )}

              {/* Students List */}
              {!loading && !error && (
                <>
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {students.length === 0 ? 'Nenhuma aluna cadastrada' : 'Nenhuma aluna encontrada'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={() => openModal()}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Cadastrar primeira aluna
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <div 
                          key={student.id} 
                          className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedStudentId === student.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedStudentId(student.id === selectedStudentId ? '' : student.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(student.plan)}`}>
                                  {getPlanLabel(student.plan)}
                                </span>
                                {selectedStudentId === student.id && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    Selecionada
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{calculateAge(student.birth_date)} anos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>{student.height}cm • {student.weight}kg</span>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  <span className="font-medium">Objetivo:</span>
                                  <span>{student.goal}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(student);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student);
                                }}
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
                </>
              )}
            </div>

            {/* Selected Student Actions */}
            {selectedStudentId && selectedStudent && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">
                      {selectedStudent.name} selecionada
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Agora você pode acessar as avaliações físicas desta aluna
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Scale className="w-4 h-4" />
                      Ver Avaliações
                    </button>
                    <button
                      onClick={() => setSelectedStudentId('')}
                      className="text-blue-600 hover:text-blue-700 px-4 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>

          {/* Student Modal */}
          <StudentModal
            isOpen={showModal}
            onClose={closeModal}
            onSave={editingStudent ? handleUpdateStudent : handleCreateStudent}
            student={editingStudent}
            title={editingStudent ? 'Editar Aluna' : 'Nova Aluna'}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
