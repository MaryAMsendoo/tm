import type { Metadata } from "next";
import { EnquiryProvider } from "@/context/EnquiryContext";
import { RequestProvider } from "@/context/RequestContext";
import { SiteProvider } from "@/context/SiteContext";
import { getCategories, getHeroSlides, getSettings } from "@/lib/server/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnquiryDrawer } from "@/components/layout/EnquiryDrawer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { socialImageUrl } from "@/lib/media";
import { siteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const [site, slides] = await Promise.all([getSettings("site"), getHeroSlides()]);
  const description = site.description || "Crafted furniture and luxury statement pieces for refined spaces.";
  // The first home-page hero photo is the picture shown when a link is shared.
  const image = slides.find((s) => s.image.includes("res.cloudinary.com"))?.image;

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: site.name, template: `%s | ${site.shortName}` },
    description,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_NG",
      description,
      images: image ? [{ url: socialImageUrl(image), width: 1200, height: 630, alt: site.name }] : undefined,
    },
    twitter: { card: "summary_large_image" },
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
