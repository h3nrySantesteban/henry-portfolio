"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUploader } from "@/components/admin/FileUploader";
import type { SiteSettings } from "@/lib/database.types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial.full_name);
  const [roleTitle, setRoleTitle] = useState(initial.role_title);
  const [heroHeading, setHeroHeading] = useState(initial.hero_heading);
  const [heroSubheading, setHeroSubheading] = useState(initial.hero_subheading);
  const [email, setEmail] = useState(initial.email);
  const [githubUrl, setGithubUrl] = useState(initial.github_url);
  const [cvUrl, setCvUrl] = useState<string | null>(initial.cv_url);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("site_settings")
      .update({
        full_name: fullName,
        role_title: roleTitle,
        hero_heading: heroHeading,
        hero_subheading: heroSubheading,
        email,
        github_url: githubUrl,
        cv_url: cvUrl,
      })
      .eq("id", 1);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <Field label="Nombre completo">
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
      </Field>

      <Field label="Rol / título">
        <input
          required
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Ej: Software Developer"
          className="input"
        />
      </Field>

      <Field label="Título del hero (usá un salto de línea para partir en dos líneas)">
        <textarea
          required
          value={heroHeading}
          onChange={(e) => setHeroHeading(e.target.value)}
          rows={2}
          className="input resize-none"
        />
      </Field>

      <Field label="Subtítulo del hero">
        <textarea
          required
          value={heroSubheading}
          onChange={(e) => setHeroSubheading(e.target.value)}
          rows={3}
          className="input resize-none"
        />
      </Field>

      <Field label="Email de contacto">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="URL de GitHub">
        <input
          required
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="input"
        />
      </Field>

      <div>
        <label className="mb-1.5 block text-sm text-foreground/70">CV (PDF)</label>
        <FileUploader folder="cv" value={cvUrl} onChange={setCvUrl} accept="application/pdf" isImage={false} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Guardar cambios
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-foreground/60">
            <Check size={15} />
            Guardado
          </span>
        )}
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
