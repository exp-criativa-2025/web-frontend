"use client";

import { useState, useEffect } from 'react';
import { useUser, User } from '@/providers/UserProvider';

export default function UsersPage() {
  const { user, updateUser, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'User',
    avatar: '/avatars/default.jpg'
  });

  useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update user in context (which will also save to localStorage)
    updateUser(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset edit data to current user
    if (user) {
      setEditData(user);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Carregando usuário...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Nenhum usuário logado</h2>
          <p className="text-gray-600">Faça login para ver suas informações</p>
        </div>
      </div>
    );
  }  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Perfil do Usuário</h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {(isEditing ? editData.name : user.name).charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? editData.name : user.name}
                </h2>
                <p className="text-blue-100">
                  {isEditing ? editData.email : user.email}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {isEditing ? editData.role : user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              // Edit Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Função
                    </label>
                    <select
                      value={editData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="User">Usuário</option>
                      <option value="Admin">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // Display Info
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Informações Pessoais
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">📧</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">📱</span>
                        <span>{user.phone || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🆔</span>
                        <span>ID: {user.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Status da Conta
                    </h3>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        user.role === 'Admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'Admin' ? '👑' : '👤'} {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info (localStorage)</h3>
          <div className="text-sm space-y-1">
            <p><strong>Current User:</strong> {user.name}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>LocalStorage Key:</strong> treko_user</p>
            <p><strong>Edit Mode:</strong> {isEditing ? 'Ativo' : 'Inativo'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}