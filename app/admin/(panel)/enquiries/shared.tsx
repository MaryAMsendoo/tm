import { cn } from "@/lib/utils";

export const KIND_LABEL = {
  quote_list: "Quote list",
  single_item: "Question about a piece",
  custom: "Custom design",
  general: "General question",
} as const;

export const STATUS_LABEL = { new: "New", contacted: "Contacted", closed: "Closed" } as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS_LABEL }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "new" && "bg-(--brand-gold) text-(--brand-wood-deep)",
        status === "contacted" && "bg-[#dbe8f5] text-[#21476b]",
        status === "closed" && "bg-[rgba(77,45,36,0.08)] text-(--text-muted)",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Dates in Lagos time, e.g. "18 Nov 2026, 14:05". */
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(date);
}
