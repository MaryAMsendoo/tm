import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { cardClass } from "@/components/admin/styles";
import { ConfirmButton, MoveButtons, PageTitle } from "@/components/admin/ui";
import { deleteCategory, moveCategory } from "./actions";
import { CategoryForm, NewCategoryForm } from "./forms";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireAdmin();
  const rows = await db
    .select({ category: categories, productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.id));

  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Categories"
        intro="Rooms and product types used in the shop filters, the footer and the portfolio. Hidden categories, and their products, don't appear on the website."
      />

      <NewCategoryForm />

      <ul className={`${cardClass} mt-6 divide-y divide-(--border-subtle)`}>
        {rows.map(({ category: c, productCount }, i) => (
          <li key={c.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <MoveButtons
              onUp={moveCategory.bind(null, c.id, "up")}
              onDown={moveCategory.bind(null, c.id, "down")}
              first={i === 0}
              last={i === rows.length - 1}
            />
            <div className="flex-1">
              <CategoryForm id={c.id} label={c.label} visible={c.visible} />
              <p className="mt-1 text-xs text-(--text-subtle)">
                Link: /shop?category={c.slug} · {productCount} product{productCount === 1 ? "" : "s"}
              </p>
            </div>
            {productCount === 0 ? (
              <ConfirmButton action={deleteCategory.bind(null, c.id)} confirmText={`Delete the category "${c.label}"?`}>
                Delete
              </ConfirmButton>
            ) : (
              <p className="max-w-40 text-xs text-(--text-subtle)">Has products, so it can&apos;t be deleted. Hide it instead.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
