"use client";

import React, { use, useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Spinner } from "@/components/spinner";
import api from "@/lib/api";
import { formatCNPJ } from "@/app/lib/formatCNPJ";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

interface AcademicEntity {
  id: number;
  type: string;
  fantasy_name: string;
  cnpj: string;
  foundation_date: string;
  status: string;
}

interface Campaign {
  id: number;
  name: string;
  description?: string;
  goal: number;
  total_donations: number;
  start_date: string;
  end_date: string;
  accepted?: string;
  academic_entity: AcademicEntity;
}

interface CampaignDetailPageProps {
  params: { id: string };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function daysRemaining(endDate: string) {
  const diffTime = new Date(endDate).getTime() - new Date().getTime();
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter()

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(1);
  const [donationLoading, setDonationLoading] = useState(false);
  const [isDonationCompleted, setIsDonationCompleted] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true);
        const res = await api.get(`/campaigns/${id}`);

        setCampaign(res.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar campanha:", err);
        setError("Erro ao buscar campanha");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <Spinner />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {error || "Campanha não encontrada"}
        </h1>
        <a href="/campaigns" className="text-blue-500 underline">
          ← Voltar para lista de campanhas
        </a>
      </div>
    );
  }

  const totalDonations = campaign.total_donations ?? 0;
  const progress = Math.min((totalDonations / campaign.goal) * 100, 100);
  const expired = new Date(campaign.end_date) < new Date();
  const handleDonation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setDonationLoading(true);
      await api.post("/donations", {
        campaign_id: campaign?.id,
        donated: donationAmount,
      });
      setDonationAmount(1);
      setIsDonationCompleted(true);
    } catch (err) {
      console.error("Erro ao realizar doação:", err);
    } finally {
      setDonationLoading(false);
    }
  };

  return (
    <div className="w-[70%] mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {campaign.name}
      </h1>

      {campaign.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-2">{campaign.description}</p>
      )}

      <div className="mb-4 text-gray-800 dark:text-gray-300">
        <span className="font-medium">Período:</span>{" "}
        {format(new Date(campaign.start_date), "PPP", { locale: ptBR })} até{" "}
        {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}
      </div>

      {/* Entidade acadêmica */}
      <div className="mb-6 border p-4 rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700" >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Entidade Acadêmica
        </h2>
        <p className="text-gray-800 dark:text-gray-300">
          <strong>Nome fantasia:</strong> {campaign.academic_entity.fantasy_name}
        </p>
        <p className="text-gray-800 dark:text-gray-300">
          <strong>Tipo:</strong> {campaign.academic_entity.type}
        </p>
        <p className="text-gray-800 dark:text-gray-300">
          <strong>CNPJ:</strong> {formatCNPJ(campaign.academic_entity.cnpj)}
        </p>
        <p className="text-gray-800 dark:text-gray-300">
          <strong>Fundação:</strong>{" "}
          {format(new Date(campaign.academic_entity.foundation_date), "PPP", {
            locale: ptBR,
          })}
        </p>
      </div>

      {/* Valores */}
      <div className="mb-4 text-gray-900 dark:text-gray-100">
        <p>
          <strong>Meta:</strong> {formatCurrency(campaign.goal)}
        </p>
        <p>
          <strong>Arrecadado:</strong> {formatCurrency(totalDonations)}
        </p>
        <p className="mb-4">
          <strong>Faltam:</strong> {formatCurrency(Math.max(campaign.goal - totalDonations, 0))}
        </p>

        <div className="mb-1 text-gray-900 dark:text-gray-100">
          <span className="font-medium">Progresso:</span> {progress.toFixed(2)}%
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
          <div
            className={`h-4 rounded-full ${expired ? "bg-red-400" : "bg-green-500"
              } transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {expired ? (
          <p className="text-red-600 dark:text-red-400 font-bold mb-6">
            Esta campanha expirou em{" "}
            {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}.
          </p>
        ) : (
          <>
            <p className="text-green-700 dark:text-green-400 font-medium mb-2">
              Ainda ativa – termina em{" "}
              {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Faltam <strong>{daysRemaining(campaign.end_date)}</strong> dias para o término.
            </p>
          </>
        )}
      </div>
      {!expired && (
        <form onSubmit={handleDonation} className="space-y-4">
          <div>
            <label
              htmlFor="donation_amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Quanto deseja doar?
            </label>
            <input
              type="text"
              name="donation_amount"
              id="donation_amount"
              required
              inputMode="numeric"
              value={formatCurrency(donationAmount / 100)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                setDonationAmount(Number(rawValue));
              }}
              className={`mt-1 block w-full border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${isDonationCompleted
                ? "cursor-not-allowed opacity-70"
                : "cursor-text"
                }`}
              disabled={isDonationCompleted}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded transition flex items-center justify-center ${isDonationCompleted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            disabled={donationLoading || isDonationCompleted}
          >
            {isDonationCompleted ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Doação realizada
              </>
            ) : donationLoading ? (
              "Processando..."
            ) : (
              "Fazer Doação"
            )}
          </button>

          <button
            className={`w-full py-2 px-4 rounded transition flex items-center justify-center text-gray-400 dark:text-gray-200 bg-gray-200 dark:bg-gray-400 cursor-pointer `}
            onClick={
              () => {
                router.push(`/orgs/${ id }`)
              }
            }
          >
            Visitar página da entidade
          </button>

        </form>
      )}
      <div className="mt-6">
        <a href="/campaigns" className="text-blue-500 hover:underline">
          ← Voltar para lista de campanhas
        </a>
      </div>
    </div>
  );
}
