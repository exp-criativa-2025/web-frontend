// src/app/modules/base/donation/page.tsx
"use client";

import CampaignCard from "@/components/campaign-card";
import React, { useEffect, useState } from "react";

type Campaign = {
  id: number;
  name: string;
  goal: number;
  startDate: string;
  endDate: string;
  academicEntityId: number;
  totalDonations: number;
};

export default function CampaignsPages() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch("http://localhost/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const result = await response.json();
        setCampaigns(result.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    }
    fetchCampaigns();
  }, []);

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
