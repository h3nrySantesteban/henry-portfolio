import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
      <p className="mt-1 text-sm text-foreground/50">Datos generales del sitio: hero, contacto y CV.</p>
      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
