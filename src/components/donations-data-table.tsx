"use client";

import * as React from "react";
import { z } from "zod";
import { useReactTable, ColumnDef, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const donationSchema = z.object({
  id: z.number(),
  donation_name: z.string(),
  name: z.string(),
  donated: z.number(),
  type: z.string(),
  date: z.string(),
});

type DonationsDataTableProps = {
  data: z.infer<typeof donationSchema>[];
};

export function DonationsDataTable({ data }: DonationsDataTableProps) {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(10);

  const filteredData = React.useMemo(() => {
    const now = new Date();

    return data.filter((donation) => {
      const matchesType = typeFilter === "all" || donation.type === typeFilter;

      const donationDate = new Date(donation.date);
      let matchesDate = true;

      if (dateRange === "30days") {
        matchesDate = donationDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "7days") {
        matchesDate = donationDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "3days") {
        matchesDate = donationDate >= new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      }

      return matchesType && matchesDate;
    });
  }, [typeFilter, dateRange, data]);

  const columns: ColumnDef<z.infer<typeof donationSchema>>[] = [
    {
      accessorKey: "donation_name",
      header: "Campanha",
    },
    {
      accessorKey: "name",
      header: "Doador",
    },
    {
      accessorKey: "donated",
      header: "Quantidade doada",
    },
    {
      accessorKey: "type",
      header: "Tipo da doação",
    },
    {
      accessorKey: "date",
      header: "Data",
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
      {/* Filtros acima da tabela */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="money">Money</SelectItem>
            <SelectItem value="Coat">Coat</SelectItem>
            <SelectItem value="food">Food</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="3days">Last 3 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
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
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Controles de paginação abaixo da tabela */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {filteredData.length} records
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}