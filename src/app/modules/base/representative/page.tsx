"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";

interface Representative {
  [key: string]: unknown;
  id: number;
  tipo: string;
  sigla: string;
  cnpj: string;
  nome_fantasia: string;
  razao_social: string;
  representant_id: string;
  universidade: string;
  campus: string;
  numero_membros: number;
  data_fundacao: string;
  telefone: string;
  email: string;
  site?: string;
  status: string;
  cep: string;
  facebook?: string;
  instagram?: string;
}

export default function RepresentativesPage() {
  const router = useRouter();
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepresentatives() {
      try {
        const response = await fetch("http://localhost/api/representatives");

        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        setRepresentatives(result.data);
      } catch (err: unknown) {
        console.error("Erro ao carregar representantes:", err);
        let errorMessage = 'Erro desconhecido';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(`Não foi possível carregar os representantes: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    fetchRepresentatives();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[400px]">
        <p>Carregando dados dos representantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable
            data={representatives}
            showNewButton
            onNew={() => router.push("/representatives/new")}
          />
        </div>
      </div>
    </div>
  );
}