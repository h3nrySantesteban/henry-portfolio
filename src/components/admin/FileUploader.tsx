"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "portfolio";

export function FileUploader({
  folder,
  value,
  onChange,
  accept = "image/*",
  isImage = true,
}: {
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  isImage?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value && isImage && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-xl bg-surface/40">
          <Image src={value} alt="" fill className="object-cover" />
        </div>
      )}

      {value && !isImage && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer noopener"
          className="mb-3 block truncate text-sm text-foreground/70 underline"
        >
          {value}
        </a>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg border border-surface px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-surface disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {value ? "Reemplazar archivo" : "Subir archivo"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-red-400"
            aria-label="Quitar archivo"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
