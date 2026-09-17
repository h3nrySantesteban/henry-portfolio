import Link from "next/link";
import Image from "next/image";
import { Layers, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteSolutionButton } from "@/components/admin/soluciones/DeleteSolutionButton";

async function getSolutions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("solutions")
    .select("*")
    .order("order_index", { ascending: true });
  return data ?? [];
}

export default async function SolucionesAdminPage() {
  const solutions = await getSolutions();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Soluciones</h1>
          <p className="mt-1 text-sm text-foreground/50">Proyectos personales mostrados en el portfolio.</p>
        </div>
        <Link
          href="/admin/soluciones/new"
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={15} />
          Nueva
        </Link>
      </div>

      {solutions.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/50">Todavía no agregaste ningún proyecto.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-surface/70 border-y border-surface/70">
          {solutions.map((solution) => (
            <div key={solution.id} className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface/40">
                {solution.image_url ? (
                  <Image src={solution.image_url} alt={solution.title} width={48} height={48} className="object-cover" />
                ) : (
                  <Layers size={18} className="text-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{solution.title}</p>
                <p className="truncate text-xs text-foreground/50">{solution.description}</p>
              </div>
              <Link
                href={`/admin/soluciones/${solution.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </Link>
              <DeleteSolutionButton id={solution.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
