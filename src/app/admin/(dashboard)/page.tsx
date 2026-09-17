import Link from "next/link";
import { Briefcase, Layers, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();
  const [companies, solutions, posts] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("solutions").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
  ]);

  return {
    companies: companies.count ?? 0,
    solutions: solutions.count ?? 0,
    posts: posts.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  const cards = [
    { href: "/admin/trabajos", label: "Trabajos", value: counts.companies, icon: Briefcase },
    { href: "/admin/soluciones", label: "Soluciones", value: counts.solutions, icon: Layers },
    { href: "/admin/blog", label: "Artículos de blog", value: counts.posts, icon: Newspaper },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
      <p className="mt-1 text-sm text-foreground/50">Gestioná el contenido de tu portfolio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-surface/70 p-5 transition-colors hover:bg-surface/30"
          >
            <Icon size={18} className="text-foreground/50" />
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-foreground/60">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
