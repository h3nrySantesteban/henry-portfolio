import { createClient } from "@/lib/supabase/server";
import type { BlogPost, Company, Solution, SiteSettings } from "@/lib/database.types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  full_name: "Henry Santesteban",
  role_title: "Software Developer",
  hero_heading: "Construyo Software\nCon Atención al Detalle",
  hero_subheading:
    "Desarrollo aplicaciones web prolijas y mantenibles, del backend al pixel, enfocado en resolver problemas reales.",
  email: "henrysantesteban@gmail.com",
  github_url: "https://github.com",
  linkedin_url: null,
  cv_url_es: null,
  cv_url_en: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    return data ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("order_index", { ascending: false })
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getSolutions(): Promise<Solution[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("solutions")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogPosts(opts?: { onlyPublished?: boolean }): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (opts?.onlyPublished) {
      query = query.eq("published", true);
    }
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}
