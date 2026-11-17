import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { cardClass } from "@/components/admin/styles";
import { PageTitle } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { KIND_LABEL, StatusBadge, formatDate } from "./shared";

export const metadata = { title: "Requests" };

const PAGE_SIZE = 50;
const filters = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireAdmin();
  const params = await searchParams;
  const status = filters.some((f) => f.value === params.status) ? (params.status as string) : "all";
  const page = Math.max(1, Number(params.page) || 1);
  const where = status === "all" ? undefined : eq(enquiries.status, status as "new" | "contacted" | "closed");

  const [rows, [{ n: total }], counts] = await Promise.all([
    db
      .select()
      .from(enquiries)
      .where(where)
      .orderBy(desc(enquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(enquiries).where(where),
    db.select({ status: enquiries.status, n: count() }).from(enquiries).groupBy(enquiries.status),
  ]);
  const countFor = (value: string) =>
    value === "all" ? counts.reduce((sum, c) => sum + c.n, 0) : (counts.find((c) => c.status === value)?.n ?? 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <PageTitle
        title="Requests"
        intro="Every quote list, product question and custom design request sent from the website, with the visitor's name and phone number."
      />

      <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={`/admin/enquiries?status=${f.value}`}
            aria-current={status === f.value ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              status === f.value
                ? "border-(--brand-wood) bg-(--brand-wood) text-(--brand-ivory)"
                : "border-(--border-subtle) text-(--brand-wood) hover:bg-[rgba(77,45,36,0.06)]",
            )}
          >
            {f.label} <span className="opacity-70">({countFor(f.value)})</span>
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className={`${cardClass} p-8 text-center text-sm text-(--text-muted)`}>No requests here yet.</p>
      ) : (
        <ul className={`${cardClass} divide-y divide-(--border-subtle)`}>
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/enquiries/${r.id}`} className="flex flex-col gap-2 p-4 transition hover:bg-[rgba(77,45,36,0.04)] sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-(--foreground)">
                    {r.name} <span className="font-normal text-(--text-muted)">· {r.phone}</span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-(--text-muted)">
                    {KIND_LABEL[r.kind]} via {r.channel === "whatsapp" ? "WhatsApp" : "email"}
                    {r.items.length > 0 && ` · ${r.items.length} piece${r.items.length === 1 ? "" : "s"}: ${r.items.map((i) => i.name).join(", ")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-(--text-subtle)">
                  <span>{formatDate(r.createdAt)}</span>
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={`/admin/enquiries?status=${status}&page=${page - 1}`} className="text-(--brand-wood) underline">Newer</Link> : <span />}
          <span className="text-(--text-muted)">Page {page} of {pages}</span>
          {page < pages ? <Link href={`/admin/enquiries?status=${status}&page=${page + 1}`} className="text-(--brand-wood) underline">Older</Link> : <span />}
        </div>
      )}
    </div>
  );
}
