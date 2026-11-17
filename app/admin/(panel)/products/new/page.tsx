import Link from "next/link";
import { asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { PageTitle } from "@/components/admin/ui";
import { createProduct } from "../actions";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const cats = await db.select({ id: categories.id, label: categories.label }).from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--brand-wood)">
        <ArrowLeft size={16} /> All products
      </Link>
      <PageTitle title="New product" intro="Add the details first. On the next screen you can upload its photos and videos." />
      <ProductForm
        action={createProduct}
        categories={cats}
        submitLabel="Create and add photos"
        values={{
          name: "",
          categoryId: null,
          description: "",
          dimensions: "",
          materials: "",
          customisable: true,
          featured: false,
          inShop: true,
          visible: true,
        }}
      />
    </div>
  );
}
