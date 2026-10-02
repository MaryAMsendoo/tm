import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Kitchens, wardrobes, TV walls and wall pieces made to order in Abuja. Price on request.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopView />
    </Suspense>
  );
}