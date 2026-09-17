"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    router.refresh();
  }

  return <ConfirmDeleteButton onConfirm={handleDelete} label="¿Eliminar este artículo? Esta acción no se puede deshacer." />;
}
