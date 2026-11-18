"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, X } from "lucide-react";
import { inputClass, secondaryButtonClass } from "@/components/admin/styles";

type Props = {
  categories: { id: number; label: string; count: number }[];
  category: number | null;
  q: string;
};

/** Category and name filters that apply as you choose or type (no Filter button). */
export function ProductFilters({ categories, category, q }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(q);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function apply(next: { category?: number | null; q?: string }) {
    const params = new URLSearchParams();
    const c = next.category === undefined ? category : next.category;
    const query = (next.q ?? text).trim();
    if (c) params.set("category", String(c));
    if (query) params.set("q", query);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <form
      className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        apply({});
      }}
    >
      <select
        name="category"
        aria-label="Category"
        value={category ?? ""}
        onChange={(e) => apply({ category: Number(e.target.value) || null })}
        className={`${inputClass} sm:max-w-60`}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label} ({c.count})
          </option>
        ))}
      </select>
      <input
        name="q"
        type="search"
        aria-label="Search by name"
        value={text}
        onChange={(e) => {
          const value = e.target.value;
          setText(value);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => apply({ q: value }), 350);
        }}
        placeholder="Search by name"
        className={inputClass}
      />
      {(category || q) && (
        <button
          type="button"
          onClick={() => {
            clearTimeout(timer.current);
            setText("");
            startTransition(() => router.replace(pathname, { scroll: false }));
          }}
          className={`${secondaryButtonClass} shrink-0`}
        >
          <X size={15} /> Clear
        </button>
      )}
      <span className="flex w-5 shrink-0 justify-center text-(--text-muted)" aria-live="polite">
        {pending && <Loader2 size={16} className="animate-spin" aria-label="Loading" />}
      </span>
    </form>
  );
}
