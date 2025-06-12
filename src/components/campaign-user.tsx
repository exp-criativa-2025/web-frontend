import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

type Campaign = {
  id: number;
  name: string;
  goal: number;
  startDate: string;
  endDate: string;
  academicEntity: AcademicEntity;
  totalDonations: number;
};

type AcademicEntity = {
  id: number;
  type: string;
  fantasyName: string;
  cnpj: string;
  foundationDate: string;
  status: string;
  cep: string;
};

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percentage = Math.min(
    (campaign.totalDonations / campaign.goal) * 100,
    100
  );

  return (
    <Card
      key={campaign.id}
      className="rounded-2xl shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
    >
      <CardHeader>
        <CardTitle className="text-xl">{campaign.name}</CardTitle>
        <div className="text-l">{campaign.academicEntity.fantasyName}</div>
        <p className="text-sm text-gray-500">
          {format(new Date(campaign.startDate), "PPP")} -{" "}
          {format(new Date(campaign.endDate), "PPP")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">Goal: ${campaign.goal}</div>
        <div className="text-sm">Raised: ${campaign.totalDonations}</div>
        <Progress value={percentage} className="h-4" />
        <div className="text-right text-xs text-muted-foreground">
          {percentage.toFixed(2)}% atingido da meta
        </div>
        <a href={`/donationUser/${campaign.id}`} className="w-full">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Doar
            </button>
        </a>
      </CardContent>
    </Card>
  );
}
