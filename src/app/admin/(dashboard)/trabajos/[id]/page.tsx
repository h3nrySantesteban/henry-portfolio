import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanyForm } from "@/components/admin/trabajos/CompanyForm";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();

  if (!company) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Editar empresa</h1>
      <div className="mt-8">
        <CompanyForm initial={company} />
      </div>
    </div>
  );
}
