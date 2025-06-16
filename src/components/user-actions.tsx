"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface UserActionsProps {
  userId: number;
  onDelete: () => void;
}

export function UserActions({ userId, onDelete }: UserActionsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/profile/${userId}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <a href={`/user/${userId}`}>
        <Button variant="default" size="sm">
          Alterar
        </Button>
      </a>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
