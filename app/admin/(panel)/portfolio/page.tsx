import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, portfolioItems } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { PageTitle } from "@/components/admin/ui";
import { PortfolioAdmin } from "./PortfolioAdmin";

export const metadata = { title: "Portfolio" };

export default async function PortfolioAdminPage() {
  await requireAdmin();
  const [items, cats] = await Promise.all([
    db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder), asc(portfolioItems.id)),
    db.select({ id: categories.id, label: categories.label }).from(categories).orderBy(asc(categories.sortOrder)),
  ]);

  return (
    <div className="max-w-5xl">
      <PageTitle
        title="Portfolio"
        intro="Finished work shown on the Portfolio page. The first 16 visible items also appear on the home page. New uploads start hidden: give them a title, then tick Visible."
      />
      <PortfolioAdmin
        categories={cats}
        items={items.map((i) => ({
          id: i.id,
          title: i.title,
          categoryId: i.categoryId,
          location: i.location ?? "",
          visible: i.visible,
          media: i.media,
        }))}
      />
    </div>
  );
}
