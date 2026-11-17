import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { customerWhatsappUrl } from "@/lib/phone";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/styles";
import { ConfirmButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { deleteEnquiry, setEnquiryStatus } from "../actions";
import { KIND_LABEL, STATUS_LABEL, StatusBadge, formatDate } from "../shared";
import { NotesForm } from "./NotesForm";

export const metadata = { title: "Request" };

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [r] = await db.select().from(enquiries).where(eq(enquiries.id, id));
  if (!r) notFound();

  const firstName = r.name.split(/\s+/)[0];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/enquiries" className="mb-6 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--brand-wood)">
        <ArrowLeft size={16} /> All requests
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-(--brand-wood)">{r.name}</h1>
          <p className="mt-1 text-sm text-(--text-muted)">
            {KIND_LABEL[r.kind]} · sent via {r.channel === "whatsapp" ? "WhatsApp" : "email"} · {formatDate(r.createdAt)}
          </p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={customerWhatsappUrl(r.phone, `Hello ${firstName}, thank you for contacting TM Artisan.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryButtonClass}
        >
          <FaWhatsapp size={16} /> Chat on WhatsApp
        </a>
        <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className={secondaryButtonClass}>
          <Phone size={16} /> Call {r.phone}
        </a>
        {r.channel === "email" && (
          <span className="inline-flex items-center gap-2 px-2 text-sm text-(--text-muted)">
            <Mail size={16} /> Check your inbox for their email.
          </span>
        )}
      </div>

      <section className={`${cardClass} mt-8 p-5`}>
        <h2 className="text-sm font-medium text-(--text-muted)">Status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map((s) => (
            <form key={s} action={setEnquiryStatus.bind(null, r.id, s)}>
              <button
                type="submit"
                disabled={r.status === s}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  r.status === s
                    ? "border-(--brand-wood) bg-(--brand-wood) text-(--brand-ivory)"
                    : "border-(--border-subtle) text-(--brand-wood) hover:bg-[rgba(77,45,36,0.06)]",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            </form>
          ))}
        </div>
      </section>

      {r.items.length > 0 && (
        <section className={`${cardClass} mt-4 p-5`}>
          <h2 className="text-sm font-medium text-(--text-muted)">Pieces ({r.items.length})</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {r.items.map((item, i) => (
              <li key={`${item.id}-${i}`} className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-(--brand-cream)">
                  {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--foreground)">{item.name}</p>
                  {item.category && <p className="text-xs text-(--text-subtle)">{item.category}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`${cardClass} mt-4 p-5`}>
        <h2 className="text-sm font-medium text-(--text-muted)">Message they sent</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-(--foreground)">{r.message || "No message."}</p>
      </section>

      <section className={`${cardClass} mt-4 p-5`}>
        <h2 className="text-sm font-medium text-(--text-muted)">Private notes</h2>
        <p className="mt-1 text-xs text-(--text-subtle)">Only admins see these, e.g. the price you quoted or when to follow up.</p>
        <NotesForm id={r.id} notes={r.notes} />
      </section>

      <div className="mt-8">
        <ConfirmButton action={deleteEnquiry.bind(null, r.id)} confirmText="Delete this request permanently?">
          Delete request
        </ConfirmButton>
      </div>
    </div>
  );
}
