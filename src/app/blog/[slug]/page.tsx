import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getBlogPostBySlug, getSiteSettings } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSiteSettings(), getBlogPostBySlug(slug)]);

  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header fullName={settings.full_name} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <Link
            href="/#blog"
            className="flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Volver al blog
          </Link>

          <div className="mt-8 flex items-center gap-3 text-xs text-foreground/50">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.read_time}</span>
            <span>·</span>
            <span>{date}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>

          {post.cover_image_url && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface/40">
              <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-invert mt-10 max-w-none prose-headings:font-semibold prose-a:text-foreground prose-strong:text-foreground prose-blockquote:border-surface prose-hr:border-surface prose-code:text-foreground">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer fullName={settings.full_name} email={settings.email} githubUrl={settings.github_url} />
    </>
  );
}
