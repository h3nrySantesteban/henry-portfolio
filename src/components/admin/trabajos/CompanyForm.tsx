"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUploader } from "@/components/admin/FileUploader";
import type { Company } from "@/lib/database.types";

export function CompanyForm({ initial }: { initial?: Company }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [period, setPeriod] = useState(initial?.period ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logo_url ?? null);
  const [orderIndex, setOrderIndex] = useState(initial?.order_index ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      name,
      role,
      period,
      description,
      logo_url: logoUrl,
      order_index: orderIndex,
    };

    const { error: dbError } = initial
      ? await supabase.from("companies").update(payload).eq("id", initial.id)
      : await supabase.from("companies").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/trabajos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm text-foreground/70">Logo</label>
        <FileUploader folder="companies" value={logoUrl} onChange={setLogoUrl} />
      </div>

      <Field label="Empresa">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Puesto">
        <input
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Ej: Desarrollador Full Stack"
          className="input"
        />
      </Field>

      <Field label="Período">
        <input
          required
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Ej: 2022 - Presente"
          className="input"
        />
      </Field>

      <Field label="Descripción">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="input resize-none"
        />
      </Field>

      <Field label="Orden">
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
          className="input"
        />
      </Field>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Guardar
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/trabajos")}
          className="flex h-10 items-center rounded-full border border-surface px-5 text-sm text-foreground/70 transition-colors hover:bg-surface"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-foreground/70">{label}</label>
      {children}
    </div>
  );
}
