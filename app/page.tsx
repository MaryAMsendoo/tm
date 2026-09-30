import { FeaturedPieces } from "@/components/home/FeaturedPieces";
import { Hero } from "../components/home/Hero";
import { ShopByRoom } from "@/components/home/ShopByRoom";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomDesigns } from "@/components/home/CustomDesigns";
import { FinalCta } from "@/components/home/FinalCta";
import { Testimonials } from "@/components/home/Testimonials";
import { PortfolioTeaser } from "@/components/home/PortfolioTeaser";

export default function Home() {
  return (
    <>
      <Hero />;
      <ShopByRoom />
      <FeaturedPieces />
      <CustomDesigns />
      <HowItWorks />
      <PortfolioTeaser />
      <Testimonials />
      <FinalCta />
    </>

  )
} 