import Link from "next/link";
import { Briefcase, Layers, Newspaper, Settings, ExternalLink } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Resumen", icon: Layers, exact: true },
  { href: "/admin/trabajos", label: "Trabajos", icon: Briefcase },
  { href: "/admin/soluciones", label: "Soluciones", icon: Layers },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col md:flex-row">
      <aside className="scrollbar-none flex shrink-0 flex-col justify-between overflow-y-auto border-b border-surface/70 px-4 py-4 md:sticky md:top-0 md:h-screen md:w-56 md:border-b-0 md:border-r md:px-5 md:py-6">
        <div>
          <p className="px-2 text-sm font-medium">Admin</p>
          <nav className="mt-5 flex gap-1 overflow-x-auto scrollbar-none md:flex-col md:overflow-visible">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 hidden flex-col gap-3 md:flex">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <ExternalLink size={15} />
            Ver sitio
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
