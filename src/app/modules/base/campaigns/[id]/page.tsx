"use client";

import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Spinner } from "@/components/spinner";
import api from "@/lib/api";
import { formatCNPJ } from "@/app/lib/formatCNPJ";

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

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = params;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-2xl font-bold mb-4">{error || "Campanha não encontrada"}</h1>
        <a href="/campaigns" className="text-blue-500 underline">
          ← Voltar para lista de campanhas
        </a>
      </div>
    );
  }

  const totalDonations = campaign.total_donations ?? 0;
  const progress = Math.min((totalDonations / campaign.goal) * 100, 100);
  const expired = new Date(campaign.end_date) < new Date();

  return (
    <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{campaign.name}</h1>

      {campaign.description && (
        <p className="text-gray-700 mb-2">{campaign.description}</p>
      )}

      <div className="mb-4">
        <span className="font-medium">Período:</span>{" "}
        {format(new Date(campaign.start_date), "PPP", { locale: ptBR })} até{" "}
        {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}
      </div>

      {/* Entidade acadêmica */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Entidade Acadêmica</h2>
        <p><strong>Nome fantasia:</strong> {campaign.academic_entity.fantasy_name}</p>
        <p><strong>Tipo:</strong> {campaign.academic_entity.type}</p>
        <p><strong>CNPJ:</strong> {formatCNPJ(campaign.academic_entity.cnpj)}</p>
        <p><strong>Fundação:</strong> {format(new Date(campaign.academic_entity.foundation_date), "PPP", { locale: ptBR })}</p>
      </div>

      {/* Valores */}
      <div className="mb-4">
        <p><strong>Meta:</strong> {formatCurrency(campaign.goal)}</p>
        <p><strong>Arrecadado:</strong> {formatCurrency(totalDonations)}</p>
        <p className="mb-4">
          <strong>Faltam:</strong>{" "}
          {formatCurrency(Math.max(campaign.goal - totalDonations, 0))}
        </p>

        <div className="mb-1">
          <span className="font-medium">Progresso:</span> {progress.toFixed(2)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
          <div
            className={`h-4 rounded-full ${
              expired ? "bg-red-400" : "bg-green-500"
            } transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {expired ? (
          <p className="text-red-600 font-bold mb-6">
            Esta campanha expirou em {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}.
          </p>
        ) : (
          <>
            <p className="text-green-700 font-medium mb-2">
              Ainda ativa – termina em {format(new Date(campaign.end_date), "PPP", { locale: ptBR })}.
            </p>
            <p className="text-gray-600 mb-6">
              Faltam <strong>{daysRemaining(campaign.end_date)}</strong> dias para o término.
            </p>
          </>
        )}
      </div>

      <form action="" method="post" className="space-y-4">
        <input type="hidden" name="campaign_id" value={campaign.id} />
        {/* Show donation fields based on campaign.accepted */}
        {campaign.accepted === "money" && (
          <div>
            <label
              htmlFor="donation_amount"
              className="block text-sm font-medium text-gray-700"
            >
              Valor da doação (R$)
            </label>
            <input
              type="number"
              name="donation_amount"
              id="donation_amount"
              min="1"
              step="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}
        {campaign.accepted === "food" && (
          <div>
            <label
              htmlFor="donation_amount"
              className="block text-sm font-medium text-gray-700"
            >
              Quantidade de alimentos (kg)
            </label>
            <input
              type="number"
              name="donation_amount"
              id="donation_amount"
              min="1"
              step="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}
        {campaign.accepted === "clothes" && (
          <>
            <div>
              <label
                htmlFor="donation_amount"
                className="block text-sm font-medium text-gray-700"
              >
                Quantidade de roupas (peças)
              </label>
              <input
                type="number"
                name="donation_amount"
                id="donation_amount"
                min="1"
                step="1"
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label
                htmlFor="donation_type"
                className="block text-sm font-medium text-gray-700 mt-5"
              >
                Tipo da roupa (Ex: Camisa, Calça, etc.)
              </label>
              <input
                type="text"
                name="donation_type"
                id="donation_type"
                placeholder="Blusa de moleton, calça jeans, etc."
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
          </>
        )}
        {campaign.accepted === "toys" && (
          <div>
            <label
              htmlFor="donation_amount"
              className="block text-sm font-medium text-gray-700"
            >
              Quantidade de brinquedos (peças)
            </label>
            <input
              type="number"
              name="donation_amount"
              id="donation_amount"
              min="1"
              step="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="donor_name"
            className="block text-sm font-medium text-gray-700"
          >
            Seu nome
          </label>
          <input
            type="text"
            name="donor_name"
            id="donor_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        {!expired ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Fazer Doação
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
            disabled
          >
            Fazer Doação
          </button>
        )}
      </form>

      <div className="mt-6">
        <a href="/campaigns" className="text-blue-500 hover:underline">
          ← Voltar para lista de campanhas
        </a>
      </div>
    </div>
  );
}
