// src/app/modules/base/donation/page.tsx
"use client";

import CampaignCard from "@/components/campaign-user";
import campainss from "@/lib/campains";
import { AnimatedBg } from "@/components/DotMatrix";

// Define a mock AcademicEntity type and value for demonstration
type AcademicEntity = {
  id: number;
  name: string;
  type: string;
  fantasyName: string;
  cnpj: string;
  foundationDate: string;
  address: string;
};

const mockAcademicEntity: AcademicEntity = {
  id: 1,
  name: "Default Academic Entity",
  type: "University",
  fantasyName: "Default Fantasy Name",
  cnpj: "00.000.000/0000-00",
  foundationDate: "2000-01-01",
  address: "123 Default St, City, Country",
};

export default function UserDonation() {
  // Map the imported data to the expected CampaignCard shape
  const campaigns = campainss.map((c: any) => ({
    id: c.id,
    name: c.campain_name,
    goal: c.goal,
    startDate: c.start_date,
    endDate: c.end_date,
    academicEntity: mockAcademicEntity,
    totalDonations: c.current_value,
    // Add any other fields if needed
  }));

  return (
    <>
      <AnimatedBg />
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
        <a
          href="/"
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-4 text-lg font-semibold rounded-none"
        >
          Voltar para a página inicial
        </a>
      </div>
    </>
  );
}
