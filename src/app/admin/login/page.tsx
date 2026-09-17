"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-surface bg-surface/40">
            <Lock size={18} />
          </div>
          <h1 className="text-xl font-medium">Panel de administración</h1>
          <p className="mt-1 text-sm text-foreground/50">Ingresá tus credenciales para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-foreground/70">
              Usuario (email)
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-surface bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-foreground/70">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-surface bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
