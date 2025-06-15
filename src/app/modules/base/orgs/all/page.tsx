"use client";

import { DataTable } from "@/components/data-table";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import data from "./data.json";


export default function GeneralDonationTab() {
  const router = useRouter();

  const [academicEntities, setAcademicEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/modules/auth/login");
    } else {
      fetchAcademicEntities();
    }
  }, []);

  async function fetchAcademicEntities() {
    try {
      setLoading(true);
      const response = await api.get("http://localhost/api/academic-entities");
      if (response.data) {
        setAcademicEntities(response.data);
        console.log("Entidades acadêmicas:", response.data);
      } else {
        throw new Error("Dados recebidos são inválidos");
      }

    } catch (error) {
      console.error("Erro ao buscar entidades acadêmicas:", error);
    } finally {
      setLoading(false);
    }
  }

   if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={academicEntities} />
        </div>
      </div>
    </div>
  );
}
