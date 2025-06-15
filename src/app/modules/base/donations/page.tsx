"use client";

import { useState, useEffect } from "react";
import { DonationsDataTable } from "@/components/donations-data-table";
import api from "@/lib/api";

interface Donation {
  id: number;
  donation_name: string;
  name: string;
  donated: number;
  type: string;
  date: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await api.get(
          "http://localhost/api/donations/"
        )
        setDonations(response.data);
      } catch (err) {
        console.error("Erro ao carregar doações:", err);
        setError(`Não foi possível carregar as doações: ${err || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <p>Carregando dados das doações...</p>
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
      <h1 className="text-2xl font-bold mb-4">Donations</h1>
      <DonationsDataTable data={donations} />
    </div>
  );
}
