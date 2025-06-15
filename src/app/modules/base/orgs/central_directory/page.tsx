"use client";

import { DataTable } from "@/components/data-table";
import data from "./data.json";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AcademicCenterPage() {

  const router = useRouter();
  const [academicCenters, setAcademicCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/modules/auth/login");
    } else {
      fetchAcademicCenters();
    }
  }, []);

  async function fetchAcademicCenters() {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token não encontrado");
      }
      console.log(localStorage.getItem("auth_token"));

    const response = await axios.get(
      "http://localhost/api/academic-entities/type/central-directories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
     if (response.status === 200) {
      setAcademicCenters(response.data);
    }
    } catch (error) {
       console.error("Erro detalhado:");
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
          <DataTable
            data={academicCenters}
            showNewButton
            onNew={() => router.push("/users/new")}
          />{" "}
        </div>
      </div>
    </div>
  );
}
