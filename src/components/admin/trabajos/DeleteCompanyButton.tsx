"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function DeleteCompanyButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("companies").delete().eq("id", id);
    router.refresh();
  }

  return <ConfirmDeleteButton onConfirm={handleDelete} label="¿Eliminar esta empresa? Esta acción no se puede deshacer." />;
}
