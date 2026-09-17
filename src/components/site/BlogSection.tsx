import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/site/BlogCard";
import type { BlogPost } from "@/lib/database.types";

export function BlogSection({ posts, authorName }: { posts: BlogPost[]; authorName: string }) {
  if (posts.length === 0) return null;

  const preview = posts.slice(0, 3);

  return (
    <section id="blog" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-foreground/50">Blog</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Últimos artículos
          </h2>
        </div>

        {posts.length > 3 && (
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            Ver todos
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((post) => (
          <BlogCard key={post.id} post={post} authorName={authorName} />
        ))}
      </div>
    </section>
  );
}
