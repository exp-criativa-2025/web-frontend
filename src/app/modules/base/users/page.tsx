"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { User, UsersDataTable } from "@/components/users-data-table";

interface CurrentUser {
  id: number;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  async function fetchUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data);

      const userResponse = await api.get("/me"); // só exemplo
      setCurrentUser(userResponse.data);

      setLoading(false);
      setDialogLoading(false);
    } catch (err) {
      setError("Erro ao carregar dados");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDeleteUser(id: number) {
    setDialogLoading(true);
    await api.delete(`/users/${id}`);
    await fetchUsers();
  }

async function handleUpdateRole(userId: number, newRole: string) {
  setDialogLoading(true);
  try {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) {
      setError("Usuário não encontrado");
      setDialogLoading(false);
      return;
    }

    if (userToUpdate.role === newRole) {
      setDialogLoading(false);
      return;
    }

    const updatePayload = {
      ...userToUpdate,
      role: newRole,
    };

    await api.put(`/users/${userId}`, updatePayload);
    await fetchUsers();
  } catch (err) {
    setError("Erro ao atualizar o papel do usuário");
  } finally {
    setDialogLoading(false);
  }
}

  if (loading || !currentUser) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 flex flex-col justify-center items-center h-64">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <UsersDataTable
        data={users}
        onDeleteUser={handleDeleteUser}
        onUpdateRole={handleUpdateRole}
        loading={dialogLoading}
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
      />
    </div>
  );
}
