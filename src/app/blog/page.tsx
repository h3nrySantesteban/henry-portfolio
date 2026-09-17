import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BlogCard } from "@/components/site/BlogCard";
import { getBlogPosts, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPosts({ onlyPublished: true }),
  ]);

  return (
    <>
      <Header fullName={settings.full_name} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-foreground/50">Blog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Todos los artículos</h1>

          {posts.length === 0 ? (
            <p className="mt-14 text-foreground/50">Todavía no hay artículos publicados.</p>
          ) : (
            <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} authorName={settings.full_name} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer fullName={settings.full_name} email={settings.email} githubUrl={settings.github_url} />
    </>
  );
}
