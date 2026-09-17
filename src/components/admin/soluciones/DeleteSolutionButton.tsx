"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function DeleteSolutionButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("solutions").delete().eq("id", id);
    router.refresh();
  }

  return <ConfirmDeleteButton onConfirm={handleDelete} label="¿Eliminar este proyecto? Esta acción no se puede deshacer." />;
}
