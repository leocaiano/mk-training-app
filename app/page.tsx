'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Key, Activity, Dumbbell, Zap, Trophy, 
  MessageCircle, DollarSign, BarChart3, Sun, Moon, 
  Search, Plus, Edit, Trash2, Bell, TrendingUp, TrendingDown, 
  Target, Clock, Award, Settings, User, Loader2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Importar os hooks do Supabase
import { 
  useStudents, 
  useStudentActions,
  useDashboardMetrics, 
  useRevenueEvolution, 
  useServiceDistribution,
  useToast 
} from '../hooks/useSupabase';

// Importar os componentes criados
import StudentModal from '../components/StudentModal';
import ExercisesPage from '../components/ExercisesPage';
import AssessmentPage from '../components/AssessmentPage';

export default function PersonalTrainerApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  // Get theme colors based on current page
  const getThemeColors = () => {
    const themes = {
      dashboard: 'rose-400',
      students: 'rose-400', 
      access: 'rose-400',
      assessment: 'rose-400',
      exercises: 'indigo-400',
      methods: 'indigo-400',
      workouts: 'indigo-400',
      communication: 'violet-400',
      financial: 'violet-400',
      reports: 'violet-400'
    };
    return themes[currentPage as keyof typeof themes] || themes.dashboard;
  };

  const themeColor = getThemeColors();

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Minhas Alunas' },
    { id: 'access', icon: Key, label: 'Gestão de Acessos' },
    { id: 'assessment', icon: Activity, label: 'Avaliação Física' },
    { id: 'exercises', icon: Dumbbell, label: 'Biblioteca de Exercícios' },
    { id: 'methods', icon: Zap, label: 'Métodos Avançados' },
    { id: 'workouts', icon: Trophy, label: 'Treinos e Desafios' },
    { id: 'communication', icon: MessageCircle, label: 'Comunicação' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'reports', icon: BarChart3, label: 'Relatórios' }
  ];

  // Get current page color
  const getPageColor = (pageId: string) => {
    if (['dashboard', 'students', 'access', 'assessment'].includes(pageId)) {
      return 'rose-400';
    } else if (['exercises', 'methods', 'workouts'].includes(pageId)) {
      return 'indigo-400';
    } else {
      return 'violet-400';
    }
  };

  // =============================================
  // TOAST COMPONENT
  // =============================================
  const ToastComponent = () => {
    if (!toast) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        toast.type === 'success' ? 'bg-green-500' :
        toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}>
        <div className="flex items-center justify-between">
          <span>{toast.message}</span>
          <button onClick={hideToast} className="ml-4 text-white hover:text-gray-200">
            ×
          </button>
        </div>
      </div>
    );
  };

  // =============================================
  // LOADING COMPONENT
  // =============================================
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <span className="ml-2 text-gray-600">Carregando...</span>
    </div>
  );

  // =============================================
  // DASHBOARD COMPONENT
  // =============================================
  const Dashboard = () => {
    const { data: metrics, loading: metricsLoading } = useDashboardMetrics();
    const { data: revenueData, loading: revenueLoading } = useRevenueEvolution();
    const { data: serviceData, loading: serviceLoading } = useServiceDistribution();
    const { students: recentStudents, loading: studentsLoading } = useStudents();

    if (metricsLoading) return <LoadingSpinner />;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard - MK Training</h1>
            <p className="text-gray-600 dark:text-gray-400">Visão geral dos negócios</p>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alunas Ativas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics?.activeStudents || 0}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-rose-100`}>
                <Users className={`h-6 w-6 text-rose-400`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Novas este Mês</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics?.newStudentsThisMonth || 0}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-rose-100`}>
                <Target className={`h-6 w-6 text-rose-400`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Mensal</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {metrics?.monthlyRevenue?.toFixed(2) || '0,00'}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-rose-100`}>
                <TrendingUp className={`h-6 w-6 text-rose-400`} />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evolução da Receita</h3>
            {revenueLoading ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="planilha" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="online" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="presencial" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Serviço</h3>
            {serviceLoading ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {(serviceData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Alunas Recentes */}
        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alunas Recentes</h3>
          {studentsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {recentStudents.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center space-x-3">
                  <img 
                    src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                    alt={student.name} 
                    className="w-10 h-10 rounded-full" 
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-400`}>
                    {student.service_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // =============================================
  // STUDENTS COMPONENT
  // =============================================
  const Students = () => {
    const { students, loading, error, searchTerm, setSearchTerm, refetch } = useStudents();
    const { updateStudent, deleteStudent, loading: actionLoading } = useStudentActions();

    const handleToggleActive = async (student: any) => {
      try {
        await updateStudent(student.id, { active: !student.active });
        showToast(`Aluna ${student.active ? 'desativada' : 'ativada'} com sucesso!`, 'success');
        refetch();
      } catch (error) {
        showToast('Erro ao atualizar status da aluna', 'error');
      }
    };

    const handleDeleteStudent = async (studentId: string, studentName: string) => {
      if (!window.confirm(`Tem certeza que deseja deletar a aluna ${studentName}?`)) {
        return;
      }

      try {
        await deleteStudent(studentId);
        showToast('Aluna deletada com sucesso!', 'success');
        refetch();
      } catch (error) {
        showToast('Erro ao deletar aluna', 'error');
      }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Erro ao carregar alunas: {error}</p>
          <button 
            onClick={refetch}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Alunas</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas alunas e acompanhe seus treinos</p>
          </div>
          <button className={`bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 flex items-center space-x-2`}>
            <Plus className="h-4 w-4" />
            <span>Nova Aluna</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white"
          />
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                    alt={student.name} 
                    className="w-12 h-12 rounded-full" 
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {student.name} {student.age && `(${student.age} anos)`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                    {student.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{student.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 hover:bg-rose-50 rounded`}>
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button 
                    onClick={() => handleDeleteStudent(student.id, student.name)}
                    className="p-2 hover:bg-red-50 rounded"
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  <button 
                    onClick={() => handleToggleActive(student)}
                    disabled={actionLoading}
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      student.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                      student.active ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.level === 'Iniciante' ? 'bg-green-100 text-green-800' :
                  student.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                  student.level === 'Avançado' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.level}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.service_type === 'Planilha' ? 'bg-blue-100 text-blue-800' :
                  student.service_type === 'Online' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {student.service_type}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.payment_status === 'Em dia' ? 'bg-green-100 text-green-800' :
                  student.payment_status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.payment_status}
                </span>
              </div>

              {/* Physical data */}
              {(student.weight || student.height || student.imc) && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {student.weight && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Peso</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{student.weight} kg</p>
                    </div>
                  )}
                  {student.height && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Altura</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{student.height} cm</p>
                    </div>
                  )}
                  {student.imc && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">IMC</p>
                      <p className="font-semibold text-green-600">
                        {student.imc} ({student.imc_status})
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Goals */}
              {student.goals && student.goals.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Objetivos:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.goals.map((goal, index) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-400`}>
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observations */}
              {student.observations && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Observações:</p>
                  <p className="text-sm text-gray-900 dark:text-white">{student.observations}</p>
                </div>
              )}

              {/* Monthly Fee */}
              {student.monthly_fee && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mensalidade:</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    R$ {student.monthly_fee.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Action button */}
              <button className={`w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white py-2 rounded-lg hover:opacity-90`}>
                Ver Treinos
              </button>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma aluna encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Tente outro termo de busca' : 'Comece adicionando sua primeira aluna'}
            </p>
            <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">
              <Plus className="h-4 w-4 inline mr-2" />
              Adicionar Aluna
            </button>
          </div>
        )}
      </div>
    );
  };

  // =============================================
  // PLACEHOLDER COMPONENTS
  // =============================================
  const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="bg-white dark:bg-slate-600 p-12 rounded-lg shadow text-center">
        <div className={`w-16 h-16 bg-${themeColor} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Award className={`h-8 w-8 text-${themeColor}`} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Em Desenvolvimento</h3>
        <p className="text-gray-600 dark:text-gray-400">Esta funcionalidade será implementada em breve!</p>
      </div>
    </div>
  );

  // =============================================
  // RENDER CURRENT PAGE
  // =============================================
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'access':
        return <PlaceholderPage title="Gestão de Acessos" description="Gerencie o acesso das alunas ao Portal" />;
      case 'assessment':
        return <PlaceholderPage title="Avaliação Física" description="Gerencie as medidas corporais e evolução das suas alunas" />;
      case 'exercises':
        return <PlaceholderPage title="Biblioteca de Exercícios" description="Gerencie seus exercícios e organize por grupos musculares" />;
      case 'methods':
        return <PlaceholderPage title="Métodos Avançados" description="Gerencie seus métodos avançados e organize por categorias" />;
      case 'workouts':
        return <PlaceholderPage title="Treinos e Desafios" description="Crie e gerencie treinos modelo para reutilização" />;
      case 'communication':
        return <PlaceholderPage title="Comunicação" description="Gerencie suas conversas com as alunas" />;
      case 'financial':
        return <PlaceholderPage title="Financeiro" description="Acompanhe suas métricas e pagamentos" />;
      case 'reports':
        return <PlaceholderPage title="Relatórios" description="Gere relatórios detalhados do seu negócio" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-800' : 'bg-slate-200'}`}>
      <ToastComponent />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 min-h-screen ${darkMode ? 'bg-slate-600' : 'bg-slate-100'} p-6 hidden md:block`}>
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className={`w-10 h-10 bg-${themeColor} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">MK</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Mayara Kerr</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personal Trainer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const pageColor = getPageColor(item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? `bg-${pageColor} text-white` 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className={`${darkMode ? 'bg-slate-600' : 'bg-slate-100'} p-6 border-b border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button would go here */}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://ui-avatars.com/api/?name=Mayara+Kerr&background=ec4899&color=fff" 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">Mayara Kerr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderCurrentPage()}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-600 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-rose-400' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
