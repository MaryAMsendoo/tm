"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import type { MediaRef } from "@/lib/types";
import type { ActionResult } from "@/lib/server/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass, labelTextClass, primaryButtonClass } from "@/components/admin/styles";
import { MediaThumb, Notice } from "@/components/admin/ui";
import { discardUpload, type ProductInput } from "./actions";

export type EditorDetails = {
  name: string;
  categoryId: string;
  description: string;
  dimensions: string;
  materials: string;
  customisable: boolean;
  featured: boolean;
  inShop: boolean;
  visible: boolean;
};

/** A photo/video in the editor: saved already (`id`) or just uploaded (`file`). */
export type EditorItem = {
  key: string;
  id?: number;
  preview: Pick<MediaRef, "kind" | "url" | "posterUrl">;
  file?: MediaRef;
  title: string;
  description: string;
};

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--brand-wood) transition hover:bg-[rgba(77,45,36,0.06)] disabled:opacity-30";

/**
 * Product details plus photos/videos and captions, saved together with one
 * button. Files upload to Cloudinary as soon as they're picked; saving waits
 * until the uploads have finished. Used by both New product and Edit product.
 */
export function ProductEditor({
  categories,
  initialDetails,
  initialItems,
  save,
  submitLabel,
  savingLabel,
}: {
  categories: { id: number; label: string }[];
  initialDetails: EditorDetails;
  initialItems: EditorItem[];
  save: (input: ProductInput) => Promise<ActionResult & { savedIds?: number[] }>;
  submitLabel: string;
  savingLabel: string;
}) {
  const [details, setDetails] = useState(initialDetails);
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ActionResult>({});
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (submitting.current) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const changed = () => {
    setDirty(true);
    setResult({});
  };
  const set = (patch: Partial<EditorDetails>) => {
    setDetails((d) => ({ ...d, ...patch }));
    changed();
  };
  const setItem = (key: string, patch: Partial<EditorItem>) => {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
    changed();
  };
  const move = (index: number, step: -1 | 1) => {
    setItems((list) => {
      const next = [...list];
      [next[index], next[index + step]] = [next[index + step], next[index]];
      return next;
    });
    changed();
  };
  const remove = (item: EditorItem) => {
    setItems((list) => list.filter((i) => i.key !== item.key));
    changed();
    // A new upload that was never saved can go straight away. Saved items are
    // only removed (and cleaned up) when the form is saved.
    if (item.file && !item.id) void discardUpload(item.file).catch(() => {});
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setResult({});
    submitting.current = true;
    startTransition(async () => {
      const res = await save({
        ...details,
        media: items.map((i) =>
          i.id ? { id: i.id, title: i.title, description: i.description } : { file: i.file!, title: i.title, description: i.description },
        ),
      });
      submitting.current = false;
      // Creating redirects away on success; updating returns a result.
      if (res) {
        setResult(res);
        if (res.ok) {
          setDirty(false);
          // New uploads are now saved items: give them their database ids.
          const ids = res.savedIds;
          if (ids && ids.length === items.length) {
            setItems((list) => list.map((item, i) => ({ ...item, id: ids[i], file: undefined })));
          }
        }
      }
    });
  };

  const busy = pending || uploading;

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className={`${cardClass} space-y-5 p-5`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelTextClass}>Name</span>
            <input value={details.name} onChange={(e) => set({ name: e.target.value })} required maxLength={120} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelTextClass}>Category</span>
            <select value={details.categoryId} onChange={(e) => set({ categoryId: e.target.value })} required className={inputClass}>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className={labelTextClass}>Description</span>
          <textarea value={details.description} onChange={(e) => set({ description: e.target.value })} rows={4} maxLength={2000} className={inputClass} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelTextClass}>Size (optional)</span>
            <input value={details.dimensions} onChange={(e) => set({ dimensions: e.target.value })} maxLength={200} placeholder="e.g. 2.4m wide x 2.6m high" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelTextClass}>Materials (optional)</span>
            <input value={details.materials} onChange={(e) => set({ materials: e.target.value })} maxLength={200} placeholder="e.g. HDF board, gloss finish" className={inputClass} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["visible", "Visible on the website", "Untick to hide it everywhere without deleting it."],
              ["inShop", "Listed in the shop", "Shown as a card in the shop grid. Its photos appear in the showroom either way."],
              ["featured", "Featured", "Shown in “Featured collections” on the home page."],
              ["customisable", "Can be customised", ""],
            ] as const
          ).map(([key, label, hint]) => (
            <label key={key} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={details[key]}
                onChange={(e) => set({ [key]: e.target.checked })}
                className="mt-0.5 h-4 w-4 accent-(--brand-wood)"
              />
              <span>
                <span className="block text-sm font-medium text-(--foreground)">{label}</span>
                {hint && <span className="block text-xs text-(--text-subtle)">{hint}</span>}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className={`${cardClass} space-y-4 p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-(--brand-wood)">Photos and videos ({items.length})</h2>
            <p className="mt-1 text-sm text-(--text-muted)">
              The first photo is the shop card image. Captions are optional. Photos up to 10 MB, videos up to 100 MB.
            </p>
          </div>
          <MediaUploader
            folder="products"
            multiple
            label="Add photos or videos"
            onBusyChange={setUploading}
            onUploaded={(file) => {
              setItems((list) => [...list, { key: file.publicId, preview: file, file, title: "", description: "" }]);
              changed();
            }}
          />
        </div>

        {items.length === 0 ? (
          <p className="rounded-xl bg-(--surface-faint) p-6 text-center text-sm text-(--text-muted)">
            No photos yet. A product needs at least one photo to appear in the shop.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={item.key} className="flex flex-col gap-3 rounded-xl border border-(--border-subtle) p-3 sm:flex-row">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className={iconButton} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <a href={item.preview.url} target="_blank" rel="noopener noreferrer" title="Open full size">
                    <MediaThumb media={item.preview} size={88} />
                  </a>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  {!item.id && <p className="text-xs font-medium text-(--brand-gold-deep)">New, saved when you press {submitLabel}</p>}
                  <input
                    value={item.title}
                    onChange={(e) => setItem(item.key, { title: e.target.value })}
                    maxLength={120}
                    placeholder="Caption (optional, defaults to the product name)"
                    aria-label="Caption"
                    className={inputClass}
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => setItem(item.key, { description: e.target.value })}
                    maxLength={1000}
                    rows={2}
                    placeholder="Text under the photo in the showroom (optional)"
                    aria-label="Description"
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label="Remove"
                  title="Remove"
                  className="self-start rounded-full p-2 text-(--text-subtle) hover:bg-[rgba(77,45,36,0.08)] hover:text-[#a5432f]"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-4 border-t border-(--border-subtle) bg-(--background)/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <button type="submit" disabled={busy} className={primaryButtonClass}>
          {pending ? savingLabel : uploading ? "Waiting for uploads..." : submitLabel}
        </button>
        {dirty && !pending && !result.error && <span className="text-sm text-(--text-muted)">Unsaved changes</span>}
        <Notice state={result} />
      </div>
    </form>
  );
}
