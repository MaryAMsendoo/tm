import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import { getShopProducts, getShowroomItems } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Kitchens, wardrobes, TV walls and wall pieces made to order in Abuja. Price on request.",
};

export default async function ShopPage() {
  const [products, showroomArchiveItems] = await Promise.all([getShopProducts(), getShowroomItems()]);
  return (
    // ShopView reads the ?category= query in the browser, so it streams in.
    <Suspense fallback={null}>
      <ShopView products={products} showroomArchiveItems={showroomArchiveItems} />
    </Suspense>
  );
}