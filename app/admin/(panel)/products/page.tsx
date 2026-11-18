import Link from "next/link";
import { and, asc, count, eq, ilike, inArray, type SQL } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { categories, productMedia, products } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { cardClass, primaryButtonClass } from "@/components/admin/styles";
import { MediaThumb, MoveButtons, PageTitle } from "@/components/admin/ui";
import { moveProduct } from "./actions";
import { ProductFilters } from "./ProductFilters";

export const metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const params = await searchParams;
  const categoryId = Number(params.category) || null;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  const filters: SQL[] = [];
  if (categoryId) filters.push(eq(products.categoryId, categoryId));
  if (q) filters.push(ilike(products.name, `%${q.replace(/[%_\\]/g, "\\$&")}%`));

  const [cats, counts, rows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select({ categoryId: products.categoryId, n: count() }).from(products).groupBy(products.categoryId),
    db
      .select()
      .from(products)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(asc(products.sortOrder), asc(products.id)),
  ]);
  const media = rows.length
    ? await db
        .select()
        .from(productMedia)
        .where(inArray(productMedia.productId, rows.map((r) => r.id)))
        .orderBy(asc(productMedia.sortOrder), asc(productMedia.id))
    : [];
  const countFor = (id: number) => counts.find((c) => c.categoryId === id)?.n ?? 0;
  const total = counts.reduce((sum, c) => sum + c.n, 0);
  const filtered = Boolean(categoryId || q);
  const label = (id: number) => cats.find((c) => c.id === id)?.label ?? "—";
  // Reordering only makes sense on the full list.
  const canReorder = !categoryId && !q;

  return (
    <div className="max-w-5xl">
      <PageTitle title="Products" intro="Everything in the shop and the showroom gallery. Each product's photos and videos appear in the showroom.">
        <Link href="/admin/products/new" className={primaryButtonClass}>
          <Plus size={16} /> New product
        </Link>
      </PageTitle>

      <ProductFilters
        categories={cats.map((c) => ({ id: c.id, label: c.label, count: countFor(c.id) }))}
        category={categoryId}
        q={q}
      />
      <p className="mb-4 text-sm text-(--text-muted)">
        {filtered
          ? `Showing ${rows.length} of ${total} products.`
          : `All ${total} products. Use the arrows to change the order they appear on the website.`}
      </p>

      {rows.length === 0 ? (
        <p className={`${cardClass} p-8 text-center text-sm text-(--text-muted)`}>No products found.</p>
      ) : (
        <ul className={`${cardClass} divide-y divide-(--border-subtle)`}>
          {rows.map((p, i) => {
            const items = media.filter((m) => m.productId === p.id);
            const videos = items.filter((m) => m.kind === "video").length;
            return (
              <li key={p.id} className="flex items-center gap-4 p-3">
                {canReorder && (
                  <MoveButtons
                    onUp={moveProduct.bind(null, p.id, "up")}
                    onDown={moveProduct.bind(null, p.id, "down")}
                    first={i === 0}
                    last={i === rows.length - 1}
                  />
                )}
                <Link href={`/admin/products/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4 rounded-lg hover:bg-[rgba(77,45,36,0.04)]">
                  {items[0] ? <MediaThumb media={items[0]} size={56} /> : <div className="h-14 w-14 shrink-0 rounded-lg bg-(--brand-cream)" />}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-(--foreground)">{p.name}</p>
                    <p className="text-xs text-(--text-muted)">
                      {label(p.categoryId)} · {items.length - videos} photo{items.length - videos === 1 ? "" : "s"}
                      {videos > 0 && `, ${videos} video${videos === 1 ? "" : "s"}`}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      {!p.visible && <Badge>Hidden</Badge>}
                      {p.visible && p.inShop && <Badge>In shop</Badge>}
                      {p.visible && !p.inShop && <Badge>Showroom only</Badge>}
                      {p.featured && <Badge>Featured</Badge>}
                      {items.length === 0 && <Badge warn>No photos yet</Badge>}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Badge({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 ${warn ? "bg-[#f6e3d9] text-[#a5432f]" : "bg-[rgba(77,45,36,0.08)] text-(--text-muted)"}`}>
      {children}
    </span>
  );
}
