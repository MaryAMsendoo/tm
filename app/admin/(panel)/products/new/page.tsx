import Link from "next/link";
import { asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { PageTitle } from "@/components/admin/ui";
import { NewProductForm } from "./NewProductForm";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const cats = await db.select({ id: categories.id, label: categories.label }).from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--brand-wood)">
        <ArrowLeft size={16} /> All products
      </Link>
      <PageTitle title="New product" intro="Fill in the details, add the photos and videos with their captions, then create the product." />
      <NewProductForm categories={cats} />
    </div>
  );
}
