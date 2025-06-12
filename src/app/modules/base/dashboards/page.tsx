"use client";

import { ChartMetricInteractive } from "@/components/chart-metric-interactive";
import { SectionCards } from "@/components/section-cards";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const retentionData = [
    { date: "2025-04-29", retentionRate: 0.96 },
    { date: "2025-04-22", retentionRate: 0.96 },
    { date: "2025-04-15", retentionRate: 0.95 },
  ];

  const churnData = [
    { date: "2025-04-29", churnRate: 0.04 },
    { date: "2025-04-22", churnRate: 0.04 },
    { date: "2025-04-15", churnRate: 0.05 },
  ];

  const [totalDonationsData, setTotalDonationsData] = useState([]);

  useEffect(() => {
    async function fetchTotalDonationsData() {
      try {
        const response = await fetch(
          "http://localhost:8000/dashboard/total-donations-by-date"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTotalDonationsData(data);
      } catch (error) {
        console.error("Error fetching total donations data:", error);
      }
    }
    fetchTotalDonationsData();
  }, []);
  
  useEffect(() => {
    toast.message("Bem vindo ao Treko!")
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartMetricInteractive
              title="Total de Doações"
              data={totalDonationsData}
              metricKey="totalDonations"
              label="Total de doações: "
              aggregation="sum"
              color="var(--primary)"
            />

            <ChartMetricInteractive
              title="Retenção de Doadores"
              data={retentionData}
              metricKey="retentionRate"
              label="Taxa de retenção: "
              aggregation="avg"
              color="var(--primary)"
            />
            <ChartMetricInteractive
              title="Churn de Doadores"
              data={churnData}
              metricKey="churnRate"
              label="Taxa de churn: "
              aggregation="avg"
              color="var(--red)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
