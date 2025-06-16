import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Campaign } from "@/app/modules/base/campaigns/page";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [formattedStartDate, setFormattedStartDate] = useState(campaign.start_date);
  const [formattedEndDate, setFormattedEndDate] = useState(campaign.end_date);

  useEffect(() => {
    setFormattedStartDate(format(new Date(campaign.start_date), "PPP", { locale: ptBR }));
    setFormattedEndDate(format(new Date(campaign.end_date), "PPP", { locale: ptBR }));
  }, [campaign.start_date, campaign.end_date]);

  const totalDonations = campaign.total_donations ?? 0;
  const percentage = Math.min((totalDonations / campaign.goal) * 100, 100);

  return (
    <Link href={`/campaigns/${campaign.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: "none", color: "inherit" }}>
        <Card
          key={campaign.id}
          className="rounded-2xl shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto cursor-pointer"
        >
          <CardHeader>
            <CardTitle className="text-xl">
              {campaign.academic_entity.fantasy_name}
            </CardTitle>
            <div className="text-l">{campaign.name}</div>
            <p className="text-sm text-gray-500">
              {formattedStartDate} até {formattedEndDate}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">Meta: {formatCurrency(campaign.goal)}</div>
            <div className="text-sm">Levantado: {formatCurrency(totalDonations)}</div>
            <Progress value={percentage} className="h-4" />
            <div className="text-right text-xs text-muted-foreground">
              {percentage.toFixed(2)}% atingido da meta
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
