"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import api from "@/lib/api";
import { Spinner } from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CNPJInput } from "@/components/cnpj-input";

const TYPE_OPTIONS = [
  { value: "academic_center", label: "Centro Acadêmico" },
  { value: "central_directory", label: "Diretório Central" },
  { value: "athletic_association", label: "Associação Atlética" },
  { value: "club", label: "Clube" },
  { value: "battery", label: "Bateria" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

export default function ParentComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Estado para saber se o usuário tem role 'representative'
  const [isRepresentative, setIsRepresentative] = useState(false);

  const [form, setForm] = useState({
    type: "",
    fantasy_name: "",
    cnpj: "",
    foundation_date: "",
    status: "",
    cep: "",
  });

  useEffect(() => {
    // Buscar entidades
    api
      .get("/academic-entities")
      .then((res) => setData(res.data))
      .catch(console.error);

    // Buscar info do usuário atual para saber role
    api
      .get("/me")
      .then((res) => {
        setIsRepresentative(res.data.role === "representative");
      })
      .catch(() => {
        setIsRepresentative(false);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreateNewEntity() {
    try {
      const res = await api.post("/academic-entities", form);
      setData((prev) => [...prev, res.data]);
      setOpen(false);
      setForm({
        type: "",
        fantasy_name: "",
        cnpj: "",
        foundation_date: "",
        status: "",
        cep: "",
      });
    } catch (error) {
      console.error("Erro ao criar entidade", error);
      alert("Erro ao criar entidade");
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <DataTable
        data={data}
        showNewButton={isRepresentative}
        onNew={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Entidade Acadêmica</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova entidade.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* campos do formulário */}
            <div className="flex flex-col gap-1">
              <label htmlFor="type" className="font-semibold">
                Tipo
              </label>
              <Select
                onValueChange={(value) => handleChange("type", value)}
                value={form.type}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="fantasy_name" className="font-semibold">
                Nome Fantasia
              </label>
              <Input
                id="fantasy_name"
                value={form.fantasy_name}
                onChange={(e) => handleChange("fantasy_name", e.target.value)}
                placeholder="Digite o nome fantasia"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cnpj" className="font-semibold">
                CNPJ
              </label>
              <CNPJInput
                value={form.cnpj}
                onChange={(val) => handleChange("cnpj", val)}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="foundation_date" className="font-semibold">
                Data de Fundação
              </label>
              <Input
                id="foundation_date"
                type="date"
                value={form.foundation_date}
                onChange={(e) => handleChange("foundation_date", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="font-semibold">
                Status
              </label>
              <Select
                onValueChange={(value) => handleChange("status", value)}
                value={form.status}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cep" className="font-semibold">
                CEP
              </label>
              <Input
                id="cep"
                value={form.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
                placeholder="Digite o CEP"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleCreateNewEntity}
              disabled={!form.type || !form.fantasy_name.trim() || !form.status}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
