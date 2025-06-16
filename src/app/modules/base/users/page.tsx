"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { User, UsersDataTable } from "@/components/users-data-table";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    const response = await api.get("/users");
    setUsers(response.data);
    setLoading(false);
    setDialogLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDeleteUser(id: number) {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  }

  if (loading) {
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
        onDeleteUser={handleDeleteUser} // pass delete handler
        loading={dialogLoading}
      />
    </div>
  );
}
