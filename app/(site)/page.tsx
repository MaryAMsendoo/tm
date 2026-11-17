import { FeaturedPieces } from "@/components/home/FeaturedPieces";
import { Hero } from "@/components/home/Hero";
import { ShopByRoom } from "@/components/home/ShopByRoom";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomDesigns } from "@/components/home/CustomDesigns";
import { FinalCta } from "@/components/home/FinalCta";
import { Testimonials } from "@/components/home/Testimonials";
import { PortfolioTeaser } from "@/components/home/PortfolioTeaser";
import {
  getActiveCategories,
  getHeroSlides,
  getPortfolio,
  getSettings,
  getShopProducts,
  getTestimonials,
} from "@/lib/server/content";

export default async function Home() {
  const [hero, slides, categories, products, portfolio, testimonials] = await Promise.all([
    getSettings("hero"),
    getHeroSlides(),
    getActiveCategories(),
    getShopProducts(),
    getPortfolio(),
    getTestimonials(),
  ]);

  // The custom-designs section shows two wall pieces; fall back to any featured products.
  const pick = (slug: string, fallback: number) =>
    (products.find((p) => p.id === slug) ?? products.filter((p) => p.featured)[fallback] ?? products[0])?.images[0] ?? "";

  return (
    <>
      <Hero brand={hero} slides={slides} />
      <ShopByRoom categories={categories} products={products} />
      <FeaturedPieces products={products} />
      <CustomDesigns mainImage={pick("wall-sculpted-shelf", 0)} secondImage={pick("wall-organic-mirror", 1)} />
      <HowItWorks />
      <PortfolioTeaser items={portfolio} />
      <Testimonials testimonials={testimonials} />
      <FinalCta />
    </>
  );
}
