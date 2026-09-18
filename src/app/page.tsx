import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrabajosSection } from "@/components/site/TrabajosSection";
import { SolucionesSection } from "@/components/site/SolucionesSection";
import { BlogSection } from "@/components/site/BlogSection";
import { Footer } from "@/components/site/Footer";
import { getCompanies, getSolutions, getBlogPosts, getSiteSettings } from "@/lib/data";

export default async function Home() {
  const [settings, companies, solutions, posts] = await Promise.all([
    getSiteSettings(),
    getCompanies(),
    getSolutions(),
    getBlogPosts({ onlyPublished: true }),
  ]);

  return (
    <>
      <Header fullName={settings.full_name} compactLogo />
      <main className="flex-1">
        <Hero settings={settings} />
        <TrabajosSection companies={companies} />
        <SolucionesSection solutions={solutions} />
        <BlogSection posts={posts} />
      </main>
      <Footer
        fullName={settings.full_name}
        email={settings.email}
        githubUrl={settings.github_url}
        linkedinUrl={settings.linkedin_url}
      />
    </>
  );
}
