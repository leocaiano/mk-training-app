'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Key, Activity, Dumbbell, Zap, Trophy, 
  MessageCircle, DollarSign, BarChart3, Sun, Moon, 
  Search, Plus, Edit, Trash2, Bell, TrendingUp, TrendingDown, 
  Target, Clock, Award, Settings, User
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados simulados (em produção virão do Supabase)
const mockData = {
  students: [
    {
      id: 1,
      name: "Mayara Kerr",
      email: "maykerr@gmail.com",
      phone: "+55 21 99772-0770",
      age: 34,
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      level: "Avançado",
      weight: 64.8,
      height: 165,
      imc: 23.8,
      imcStatus: "Normal",
      goals: ["Perda de peso", "Ganho de massa muscular", "Fortalecimento"],
      observations: "Linda e cheirosa!",
      workouts: "A",
      active: true,
      hasPortalAccess: true,
      lastLogin: "2024-06-20",
      paymentStatus: "Em dia"
    },
    {
      id: 2,
      name: "Mary Jane",
      email: "leocaiano@gmail.com", 
      phone: "552199846300906",
      age: 41,
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      level: "Intermediário",
      weight: 70.0,
      height: 170,
      imc: 24.2,
      imcStatus: "Normal",
      goals: ["Resistência", "Resistência cardiovascular", "Flexibilidade"],
      observations: "Dor lombar",
      workouts: "3",
      active: true,
      hasPortalAccess: true,
      lastLogin: "2024-06-19",
      paymentStatus: "Em dia"
    },
    {
      id: 3,
      name: "Bailarina Capuccina",
      email: "capuccina@gmail.com",
      phone: "+55 21 99999-9999", 
      age: 57,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      level: "Atleta",
      weight: 60.0,
      height: 158,
      imc: 24.0,
      imcStatus: "Normal",
      goals: ["Condicionamento geral", "Preparação para competição", "Reabilitação"],
      observations: "Tung Tung Tung Sahur",
      workouts: "Nenhum treino criado",
      active: true,
      hasPortalAccess: false,
      lastLogin: "Nunca",
      paymentStatus: "Em dia"
    },
    {
      id: 4,
      name: "Aluna Teste 2",
      email: "alunateste2@gmail.com",
      phone: "+55 21 99999-9999",
      age: 28,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      level: "Iniciante",
      weight: 58.0,
      height: 162,
      imc: 22.1,
      imcStatus: "Normal",
      goals: ["Condicionamento geral", "Flexibilidade", "Fortalecimento"],
      observations: "teste 1",
      workouts: "Nenhum treino criado",
      active: true,
      hasPortalAccess: true,
      lastLogin: "2024-06-21",
      paymentStatus: "Pendente"
    }
  ],
  exercises: [
    {
      id: 1,
      name: "Supino Reto",
      group: "Peito",
      level: "Intermediário",
      equipment: "Halter",
      description: "Deite-se em um banco reto, segurando um halter em cada mão. Deite-se com os halteres nos lados dos ombros, palmas das mãos voltadas para a frente e empurre-os para cima até que os braços estejam completamente estendidos acima do peito. Segure por um momento e, lentamente, abaixe de volta à posição inicial.",
      videoUrl: "https://www.youtube.com/watch?v=demo1"
    },
    {
      id: 2, 
      name: "Puxada pela Frente",
      group: "Costas",
      level: "Iniciante",
      equipment: "Máquina",
      description: "Sente-se na máquina de puxada, segure a barra com pegada pronada e puxe em direção ao peito.",
      videoUrl: "https://www.youtube.com/watch?v=demo2"
    }
  ],
  advancedMethods: [
    {
      id: 1,
      name: "Progressão de Carga",
      category: "Progressão",
      icon: "📈",
      description: "Começa leve até chegar ao limite.",
      videoUrl: "https://youtu.be/hQZGphah7SE"
    },
    {
      id: 2,
      name: "Drop Set Reverso", 
      category: "Intensidade",
      icon: "⚡",
      description: "Técnica de intensificação progressiva.",
      videoUrl: "https://youtu.be/example"
    }
  ],
  workoutTemplates: [
    {
      id: 1,
      name: "A - Peito, Ombro e Tríceps",
      category: "Força",
      difficulty: "Iniciante", 
      duration: "60min",
      exercises: 6,
      tags: ["academia", "push", "peito", "+2"]
    },
    {
      id: 2,
      name: "B - Pernas",
      category: "Força",
      difficulty: "Iniciante",
      duration: "60min", 
      exercises: 2,
      tags: ["academia", "pernas"]
    }
  ]
};

// Dados para gráficos
const evolutionData = [
  { date: '14/06', weight: 65.0, imc: 23.9 },
  { date: '15/06', weight: 64.8, imc: 23.8 },
  { date: '16/06', weight: 64.5, imc: 23.7 },
  { date: '17/06', weight: 64.2, imc: 23.6 },
  { date: '18/06', weight: 64.0, imc: 23.5 },
  { date: '19/06', weight: 63.8, imc: 23.4 },
  { date: '20/06', weight: 63.5, imc: 23.3 }
];

const revenueData = [
  { month: 'Jan', planilha: 150, online: 200, presencial: 180 },
  { month: 'Fev', planilha: 180, online: 220, presencial: 200 },
  { month: 'Mar', planilha: 200, online: 250, presencial: 220 },
  { month: 'Abr', planilha: 220, online: 280, presencial: 240 },
  { month: 'Mai', planilha: 240, online: 300, presencial: 260 },
  { month: 'Jun', planilha: 260, online: 320, presencial: 280 }
];

const pieData = [
  { name: 'Presencial', value: 45, color: '#ec4899' },
  { name: 'Online', value: 35, color: '#8b5cf6' },
  { name: 'Planilha', value: 20, color: '#06b6d4' }
];

export default function PersonalTrainerApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState(mockData.students);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Dashboard Component
  const Dashboard = () => (
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
            <div className={`p-3 rounded-lg bg-rose-100`}>
              <Users className={`h-6 w-6 text-rose-400`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Novos Planos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
            <div className={`p-3 rounded-lg bg-rose-100`}>
              <Target className={`h-6 w-6 text-rose-400`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance Geral</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">100.0%</p>
            </div>
            <div className={`p-3 rounded-lg bg-rose-100`}>
              <TrendingUp className={`h-6 w-6 text-rose-400`} />
            </div>
          </div>
        </div>
      </div>

      {/* Alunas e Rendimento por Tipo de Serviço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Planilha</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">2 alunas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 120,00</p>
          <div className="mt-2 text-sm text-green-600">R$ 80,00 este mês</div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Online</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">1 aluna</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 195,00</p>
          <div className="mt-2 text-sm text-green-600">R$ 195,00 este mês</div>
        </div>

        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Presencial</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">1 aluna</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 195,00</p>
          <div className="mt-2 text-sm text-green-600">R$ 195,00 este mês</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evolução da Receita</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="planilha" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="online" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="presencial" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Serviço</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alunas Recentes */}
      <div className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alunas Mensais</h3>
        <div className="space-y-3">
          {students.slice(0, 3).map((student) => (
            <div key={student.id} className="flex items-center space-x-3">
              <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-400`}>
                Online
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Students Component
  const Students = () => {
    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white dark:bg-slate-600 p-6 rounded-lg shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{student.name} ({student.age} anos)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 hover:bg-rose-50 rounded`}>
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  <div className={`w-10 h-6 bg-${student.active ? 'green-500' : 'gray-300'} rounded-full relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${student.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
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
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Planilha</span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Padrão</span>
              </div>

              {/* Physical data */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Peso</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{student.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Altura</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{student.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">IMC</p>
                  <p className="font-semibold text-green-600">{student.imc} ({student.imcStatus})</p>
                </div>
              </div>

              {/* Goals */}
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

              {/* Observations */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Observações:</p>
                <p className="text-sm text-gray-900 dark:text-white">{student.observations}</p>
              </div>

              {/* Workouts */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Treinos:</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900 dark:text-white">{student.workouts}</span>
                  <button className="p-1">
                    <Settings className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Action button */}
              <button className={`w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white py-2 rounded-lg hover:opacity-90`}>
                Ver Treinos
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Placeholder components for other pages
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

  // Render current page
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
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
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
