import type { Metadata } from "next";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { PortfolioGallery } from "../../components/portfolio/PortfolioGallery";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Kitchens, wardrobes, TV walls and wall pieces built by TM Artisan in Abuja.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        title="Work we have finished."
        intro="Kitchens, wardrobes, TV walls and wall pieces, built to the size of each room."
        variant="mosaic"
      />
      <section className="relative overflow-clip">
        <SectionBackdrop variant="dune" tone="light" className="opacity-90" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8 lg:pb-28">
          <PortfolioGallery />
        </div>
      </section>
    </>
  );
}