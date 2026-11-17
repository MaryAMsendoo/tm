import { asc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { PageTitle } from "@/components/admin/ui";
import { TestimonialsAdmin } from "./TestimonialsAdmin";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  await requireAdmin();
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
  return (
    <div className="max-w-4xl">
      <PageTitle title="Testimonials" intro="Client quotes shown on the home page, in this order. The photo is optional; without one, the client's initials are shown." />
      <TestimonialsAdmin
        items={rows.map((r) => ({ id: r.id, quote: r.quote, name: r.name, detail: r.detail ?? "", visible: r.visible, avatar: r.avatar }))}
      />
    </div>
  );
}
