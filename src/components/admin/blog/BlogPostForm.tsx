"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUploader } from "@/components/admin/FileUploader";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/lib/database.types";

export function BlogPostForm({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [readTime, setReadTime] = useState(initial?.read_time ?? "5 min");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initial?.cover_image_url ?? null);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      category,
      read_time: readTime,
      cover_image_url: coverImageUrl,
      published,
    };

    const { error: dbError } = initial
      ? await supabase.from("blog_posts").update(payload).eq("id", initial.id)
      : await supabase.from("blog_posts").insert(payload);

    if (dbError) {
      setError(dbError.message.includes("duplicate") ? "Ya existe un artículo con ese slug." : dbError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm text-foreground/70">Imagen de portada</label>
        <FileUploader folder="blog" value={coverImageUrl} onChange={setCoverImageUrl} />
      </div>

      <Field label="Título">
        <input required value={title} onChange={(e) => handleTitleChange(e.target.value)} className="input" />
      </Field>

      <Field label="Slug (URL)">
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="input font-mono text-xs"
        />
      </Field>

      <Field label="Resumen">
        <textarea
          required
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="input resize-none"
        />
      </Field>

      <Field label="Contenido (Markdown)">
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="input resize-none font-mono text-xs"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría">
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej: Productividad"
            className="input"
          />
        </Field>
        <Field label="Tiempo de lectura">
          <input
            required
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="Ej: 5 min"
            className="input"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-foreground/70">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-surface bg-transparent accent-foreground"
        />
        Publicado
      </label>

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
          onClick={() => router.push("/admin/blog")}
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
