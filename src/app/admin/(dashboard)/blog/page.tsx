import Link from "next/link";
import Image from "next/image";
import { FileText, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeletePostButton } from "@/components/admin/blog/DeletePostButton";

async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function BlogAdminPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-foreground/50">Artículos mostrados en la sección de blog.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={15} />
          Nuevo
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/50">Todavía no escribiste ningún artículo.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-surface/70 border-y border-surface/70">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface/40">
                {post.cover_image_url ? (
                  <Image src={post.cover_image_url} alt={post.title} width={48} height={48} className="object-cover" />
                ) : (
                  <FileText size={18} className="text-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{post.title}</p>
                <p className="truncate text-xs text-foreground/50">
                  {post.category} · {post.published ? "Publicado" : "Borrador"}
                </p>
              </div>
              <Link
                href={`/admin/blog/${post.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </Link>
              <DeletePostButton id={post.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
