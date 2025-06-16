"use client";

import React, { useEffect, useState } from 'react';
import CampaignCard from "@/components/campaign-card";
import { AnimatedBg } from "@/components/DotMatrix";

interface Campaign {
  id: number;
  name: string;
  goal: number;
  start_date: string;
  end_date: string;
  academic_entity_id: number;
  created_at: string;
  updated_at: string;
}

export default function UserDonation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/campaigns', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro na resposta da API');
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Campaign[]) => {
        setCampaigns(data);
      })
      .catch(error => {
        console.error('Erro ao buscar campaigns:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <>
      <AnimatedBg />
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
        <a
          href="/"
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-4 text-lg font-semibold"
        >
          Voltar para a página inicial
        </a>
      </div>
    </>
  );
}
