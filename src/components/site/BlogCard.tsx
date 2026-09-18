import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import type { BlogPost } from "@/lib/database.types";

export function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface/40">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/30">
            <FileText size={36} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-foreground/50">
        <span>{post.category}</span>
        <span>{post.read_time}</span>
      </div>

      <h3 className="mt-2 text-lg font-medium transition-colors group-hover:text-foreground/80">
        {post.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{post.excerpt}</p>

      <p className="mt-4 text-xs text-foreground/40">{date}</p>
    </Link>
  );
}
