import Link from "next/link";
import Image from "next/image";
import { Building2, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteCompanyButton } from "@/components/admin/trabajos/DeleteCompanyButton";

async function getCompanies() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .order("order_index", { ascending: true });
  return data ?? [];
}

export default async function TrabajosAdminPage() {
  const companies = await getCompanies();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trabajos</h1>
          <p className="mt-1 text-sm text-foreground/50">Empresas mostradas en la sección de experiencia.</p>
        </div>
        <Link
          href="/admin/trabajos/new"
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={15} />
          Nueva
        </Link>
      </div>

      {companies.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/50">Todavía no agregaste ninguna empresa.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-surface/70 border-y border-surface/70">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface/40">
                {company.logo_url ? (
                  <Image src={company.logo_url} alt={company.name} width={48} height={48} className="object-contain" />
                ) : (
                  <Building2 size={18} className="text-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{company.name}</p>
                <p className="truncate text-xs text-foreground/50">
                  {company.role} · {company.period}
                </p>
              </div>
              <Link
                href={`/admin/trabajos/${company.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </Link>
              <DeleteCompanyButton id={company.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
