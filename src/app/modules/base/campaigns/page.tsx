"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import CampaignCard from "@/components/campaign-card";
import { Spinner } from "@/components/spinner";

export interface Campaign {
  id: number;
  name: string;
  goal: number;
  start_date: string;
  end_date: string;
  academic_entity: AcademicEntity;
  total_donations: number;
};

export interface AcademicEntity {
  id: number;
  type: string;
  fantasy_name: string;
  cnpj: string;
  foundation_date: string;
  status: string;
  cep: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function CampaignsPages() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await api.get("http://localhost/api/campaigns");
        setCampaigns(response.data);

      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {campaigns.map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
