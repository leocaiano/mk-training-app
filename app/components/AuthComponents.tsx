import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return false;
    }

    if (!isLogin) {
      if (!name) {
        setError('Nome é obrigatório');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Senhas não conferem');
        return false;
      }
      if (password.length < 6) {
        setError('Senha deve ter pelo menos 6 caracteres');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message === 'Invalid login credentials' 
            ? 'Email ou senha incorretos' 
            : error.message
          );
        } else {
          onClose();
          resetForm();
        }
      } else {
        const { error } = await signUp(email, password, { name });
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Conta criada! Verifique seu email para ativar.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 3000);
        }
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isLogin 
              ? 'Acesse sua conta MK Training' 
              : 'Crie sua conta para começar'
            }
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirme sua senha"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleModeSwitch}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={loading}
            >
              {isLogin 
                ? 'Não tem conta? Criar nova conta' 
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 font-medium">
          {user.user_metadata?.name || user.email}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <p className="font-medium text-gray-900">
              {user.user_metadata?.name || 'Usuário'}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};
