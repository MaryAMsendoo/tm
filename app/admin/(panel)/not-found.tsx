import Link from "next/link";
import { secondaryButtonClass } from "@/components/admin/styles";

/** A product or request that no longer exists (deleted, or an old link). */
export default function AdminNotFound() {
  return (
    <div className="max-w-xl py-10">
      <h1 className="font-display text-4xl font-semibold text-(--brand-wood)">Not found</h1>
      <p className="mt-3 text-sm text-(--text-muted)">This item may have been deleted, or the link is out of date.</p>
      <Link href="/admin" className={`${secondaryButtonClass} mt-6`}>
        Back to the dashboard
      </Link>
    </div>
  );
}
