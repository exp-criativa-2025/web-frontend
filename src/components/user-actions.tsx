"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserActionsProps {
  userId: number;
  currentUserId: number;
  currentUserRole: string;
  onDelete: () => void;
  cpf?: string;
  role?: string;
  onUpdateRole: (userId: number, newRole: string) => Promise<void>;
}

const ROLES = ["donor", "admin", "representative"] as const;

export function UserActions({
  userId,
  currentUserId,
  currentUserRole,
  onDelete,
  cpf,
  role,
  onUpdateRole,
}: UserActionsProps) {
  const router = useRouter();

  const canDelete = currentUserRole === "admin" || currentUserId === userId;
  const canEdit = currentUserRole === "admin";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(role ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) setSelectedRole(role);
  }, [role]);

  async function handleSave() {
    if (selectedRole && selectedRole !== role) {
      setSaving(true);
      try {
        await onUpdateRole(userId, selectedRole);
        setIsDialogOpen(false);
      } finally {
        setSaving(false);
      }
    } else {
      setIsDialogOpen(false);
    }
  }

  return (
    <>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/profile/${userId}`)}
          aria-label="Visualizar perfil"
        >
          <Eye className="w-4 h-4" />
        </Button>

        {canEdit && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Editar usuário"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}

        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            aria-label="Deletar usuário"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique o cargo do usuário abaixo. O CPF é somente leitura.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF (somente leitura)
              </label>
              <input
                type="text"
                value={cpf ?? ""}
                readOnly
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
