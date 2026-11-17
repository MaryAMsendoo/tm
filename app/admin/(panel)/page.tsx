import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { enquiries, products, productMedia } from "@/db/schema";
import { cardClass } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/server/auth";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  // Pages render in parallel with the layout, so each page checks the session itself.
  await requireAdmin();
  const [[newRequests], [allRequests], [productCount], [mediaCount]] = await Promise.all([
    db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
    db.select({ n: count() }).from(enquiries),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(productMedia),
  ]);

  const tiles = [
    { label: "New requests", value: newRequests.n, href: "/admin/enquiries?status=new" },
    { label: "All requests", value: allRequests.n, href: "/admin/enquiries" },
    { label: "Products", value: productCount.n, href: "/admin/products" },
    { label: "Photos and videos", value: mediaCount.n, href: "/admin/products" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold text-[var(--brand-wood)]">Overview</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Requests from the website, and what is on it.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className={`${cardClass} block p-5 transition hover:border-[var(--brand-gold)]`}>
              <p className="text-sm text-[var(--text-muted)]">{t.label}</p>
              <p className="mt-2 font-display text-4xl font-semibold text-[var(--brand-wood)]">{t.value}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
