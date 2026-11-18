import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/db";
import { categories, productMedia, products } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { ConfirmButton, PageTitle } from "@/components/admin/ui";
import { secondaryButtonClass } from "@/components/admin/styles";
import { deleteProduct, updateProduct } from "../actions";
import { ProductForm } from "../ProductForm";
import { MediaManager } from "./MediaManager";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const created = (await searchParams).created === "1";

  const [[product], cats, media] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)),
    db.select({ id: categories.id, label: categories.label, slug: categories.slug }).from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(productMedia).where(eq(productMedia.productId, id)).orderBy(asc(productMedia.sortOrder), asc(productMedia.id)),
  ]);
  if (!product) notFound();
  const category = cats.find((c) => c.id === product.categoryId);

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--brand-wood)">
        <ArrowLeft size={16} /> All products
      </Link>
      <PageTitle title={product.name} intro={created ? "Product created. You can change anything below." : undefined}>
        {category && (
          <a href={`/shop?category=${category.slug}`} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
            <ExternalLink size={16} /> View in shop
          </a>
        )}
      </PageTitle>

      <ProductForm
        action={updateProduct.bind(null, product.id)}
        categories={cats}
        submitLabel="Save details"
        values={{
          name: product.name,
          categoryId: product.categoryId,
          description: product.description,
          dimensions: product.dimensions ?? "",
          materials: product.materials ?? "",
          customisable: product.customisable,
          featured: product.featured,
          inShop: product.inShop,
          visible: product.visible,
        }}
      />

      <MediaManager
        productId={product.id}
        productName={product.name}
        media={media.map((m) => ({
          id: m.id,
          kind: m.kind,
          url: m.url,
          posterUrl: m.posterUrl,
          title: m.title ?? "",
          description: m.description ?? "",
        }))}
      />

      <div className="mt-10 border-t border-(--border-subtle) pt-6">
        <ConfirmButton
          action={deleteProduct.bind(null, product.id)}
          confirmText={`Delete "${product.name}" and its ${media.length} photo(s) and video(s)? This cannot be undone.`}
        >
          Delete product
        </ConfirmButton>
      </div>
    </div>
  );
}
