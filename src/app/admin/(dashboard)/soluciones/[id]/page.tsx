import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SolutionForm } from "@/components/admin/soluciones/SolutionForm";

export default async function EditSolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: solution } = await supabase.from("solutions").select("*").eq("id", id).maybeSingle();

  if (!solution) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Editar proyecto</h1>
      <div className="mt-8">
        <SolutionForm initial={solution} />
      </div>
    </div>
  );
}
