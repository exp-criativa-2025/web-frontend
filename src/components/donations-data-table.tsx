/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { z } from "zod";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCNPJ } from "@/app/lib/formatCNPJ";

const donationSchema = z.object({
  id: z.number(),
  donated: z.number(),
  date: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
  }),
  campaign: z.object({
    id: z.number(),
    name: z.string(),
    academic_entity: z
      .object({
        id: z.number(),
        fantasy_name: z.string().optional(),
        cnpj: z.string().optional(),
      })
      .optional(),
  }),
  type: z.string().optional(),
});

type Donation = z.infer<typeof donationSchema>;

type DonationsDataTableProps = {
  data: Donation[];
};

export function DonationsDataTable({ data }: DonationsDataTableProps) {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(10);

  // Flag para saber se já estamos no cliente
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Só aplicamos filtro de data quando estamos no cliente, para evitar mismatch SSR x cliente
  const filteredData = React.useMemo(() => {
    if (!isClient) return data; // no SSR, mostra os dados originais sem filtro de data

    const now = new Date();

    return data.filter((donation) => {
      const matchesType = typeFilter === "all" || donation.type === typeFilter;

      const donationDate = new Date(donation.date);
      let matchesDate = true;

      if (dateRange === "30days") {
        matchesDate =
          donationDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "7days") {
        matchesDate =
          donationDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "3days") {
        matchesDate =
          donationDate >= new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      }

      return matchesType && matchesDate;
    });
  }, [typeFilter, dateRange, data, isClient]);

  const columns: ColumnDef<Donation>[] = [
    {
      accessorKey: "campaign.name",
      header: "Campanha",
      cell: ({ getValue }) => getValue() ?? "N/A",
    },
    {
      accessorKey: "campaign.academic_entity.fantasy_name",
      header: "Entidade acadêmica",
      cell: ({ getValue }) => getValue() ?? "N/A",
    },
    {
      accessorKey: "campaign.academic_entity.cnpj",
      header: "CNPJ",
      cell: ({ getValue }) => formatCNPJ(getValue() as string | undefined),
    },
    {
      accessorKey: "user.name",
      header: "Doador",
      cell: ({ getValue }) => getValue() ?? "N/A",
    },
    {
      accessorKey: "donated",
      header: "Quantidade doada",
      cell: ({ getValue }) => `R$ ${(getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString("pt-BR"),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Table className="border rounded-lg">
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === "string"
                    ? header.column.columnDef.header
                    : header.column.columnDef.header?.(header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.cell
                      ? typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {filteredData.length}{" "}
          registros
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
