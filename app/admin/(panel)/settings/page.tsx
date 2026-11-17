import { requireAdmin } from "@/lib/server/auth";
import { getSettingsFresh } from "@/lib/server/admin-reads";
import { PageTitle } from "@/components/admin/ui";
import { AboutForm, FounderForm, SiteForm } from "./forms";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const [site, about, founder] = await Promise.all([
    getSettingsFresh("site"),
    getSettingsFresh("about"),
    getSettingsFresh("founder"),
  ]);

  return (
    <div className="max-w-4xl space-y-10">
      <PageTitle title="Site settings" intro="Business details used across the website, and the text of the About page. Each section saves separately." />
      <SiteForm initial={site} />
      <AboutForm initial={about} />
      <FounderForm initial={founder} />
    </div>
  );
}
