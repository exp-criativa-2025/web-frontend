import React from "react";
import campains from "@/lib/campains.js"; // mock local
import { AnimatedBg } from "@/components/DotMatrix"; // importe o AnimatedBg

interface DonationPageProps {
  params: { id: string };
}

export default function DonationDetailPage({ params }: DonationPageProps) {
  const id = parseInt(params.id, 10);
  const campain = campains.find((c) => c.id === id);

  if (!campain) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Campanha não encontrada</h1>
        <a href="/donation" className="text-blue-500 underline">
          ← Voltar para lista de doações
        </a>
      </div>
    );
  }

  const progress = Math.round((campain.current_value / campain.goal) * 100);
  const expired = new Date(campain.end_date) < new Date();

  return (
    <>
      <AnimatedBg />
      <div className="relative z-10 w-[70%] m-30 p-6 bg-white rounded-lg shadow-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">{campain.campain_name}</h1>
        <p className="text-gray-700 mb-2">{campain.description}</p>
        <div className="mb-4">
          <span className="font-medium">Período:</span>{" "}
          {campain.start_date} até {campain.end_date}
        </div>

        <div className="mb-1">
          <span className="font-medium">Progresso:</span> {progress}%
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
            Esta campanha expirou em {campain.end_date}.
          </p>
        ) : (
          <p className="text-green-700 font-medium mb-6">
            Ainda ativa – termina em {campain.end_date}.
          </p>
        )}

        <form action="" method="post" className="space-y-4">
          <input type="hidden" name="campain_id" value={campain.id} />
          {campain.accepted == "money" ? (
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
          ) : null}
          {campain.accepted == "food" ? (
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
          ) : null}
          {campain.accepted == "clothes" ? (
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
              <label
                htmlFor="donation_type"
                className="block text-sm font-medium text-gray-700 mt-5"
              >
                Tipo da roupa (Ex: Camisa, Calça, etc.)
              </label>
              <input
                type="string"
                name="donation_type"
                id="donation_type"
                placeholder="Blusa de moletom, calça jeans, etc."
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
          ) : null}
          {campain.accepted == "toys" ? (
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
          ) : null}

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
          <a href="/donationUser" className="text-blue-500 hover:underline">
            ← Voltar para lista de doações
          </a>
        </div>
      </div>
    </>
  );
}