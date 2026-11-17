import type { Metadata } from "next";
import { EnquiryProvider } from "@/context/EnquiryContext";
import { RequestProvider } from "@/context/RequestContext";
import { SiteProvider } from "@/context/SiteContext";
import { getCategories, getSettings } from "@/lib/server/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnquiryDrawer } from "@/components/layout/EnquiryDrawer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings("site");
  return {
    title: { default: site.name, template: `%s | ${site.shortName}` },
    description: site.description || "Crafted furniture and luxury statement pieces for refined spaces.",
  };
}

/** Public website: header, footer, quote list and the request dialog. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [site, categories] = await Promise.all([getSettings("site"), getCategories()]);

  return (
    <SiteProvider site={site} categories={categories}>
      <EnquiryProvider>
        <RequestProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <EnquiryDrawer />
          <WhatsAppFab />
        </RequestProvider>
      </EnquiryProvider>
    </SiteProvider>
  );
}
