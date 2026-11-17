"use client";

import { useActionState } from "react";
import type { MediaRef } from "@/lib/types";
import type { ActionResult } from "@/lib/server/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass } from "@/components/admin/styles";
import { ConfirmButton, MediaThumb, MoveButtons, Notice, SubmitButton } from "@/components/admin/ui";
import {
  addPortfolioItem,
  deletePortfolioItem,
  movePortfolioItem,
  replacePortfolioMedia,
  updatePortfolioItem,
} from "../content-actions";

type Item = { id: number; title: string; categoryId: number | null; location: string; visible: boolean; media: MediaRef };
type Category = { id: number; label: string };

export function PortfolioAdmin({ items, categories }: { items: Item[]; categories: Category[] }) {
  return (
    <>
      <div className={`${cardClass} p-4`}>
        <MediaUploader folder="portfolio" multiple label="Upload photos or videos" onUploaded={(m) => addPortfolioItem(m)} />
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li key={item.id} className={`${cardClass} flex flex-col gap-4 p-4 lg:flex-row`}>
            <div className="flex items-start gap-3">
              <MoveButtons
                onUp={movePortfolioItem.bind(null, item.id, "up")}
                onDown={movePortfolioItem.bind(null, item.id, "down")}
                first={i === 0}
                last={i === items.length - 1}
              />
              <div className="space-y-2">
                <a href={item.media.url} target="_blank" rel="noopener noreferrer" title="Open full size">
                  <MediaThumb media={item.media} size={110} alt={item.title} />
                </a>
                <MediaUploader folder="portfolio" label="Replace" onUploaded={(m) => replacePortfolioMedia(item.id, m)} />
              </div>
            </div>
            <ItemForm item={item} categories={categories} />
            <div className="lg:self-start">
              <ConfirmButton action={deletePortfolioItem.bind(null, item.id)} confirmText={`Delete "${item.title}" from the portfolio?`}>
                Delete
              </ConfirmButton>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function ItemForm({ item, categories }: { item: Item; categories: Category[] }) {
  const [state, action] = useActionState<ActionResult, FormData>(updatePortfolioItem.bind(null, item.id), {});
  return (
    <form action={action} className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
      <input name="title" defaultValue={item.title} required maxLength={120} aria-label="Title" placeholder="Title" className={`${inputClass} sm:col-span-2`} />
      <select name="categoryId" defaultValue={item.categoryId ?? ""} aria-label="Category" className={inputClass}>
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <input name="location" defaultValue={item.location} maxLength={120} aria-label="Location" placeholder="Location (optional), e.g. Maitama" className={inputClass} />
      <label className="flex items-center gap-2 text-sm text-(--text-muted)">
        <input type="checkbox" name="visible" defaultChecked={item.visible} className="h-4 w-4 accent-(--brand-wood)" />
        Visible on the website
      </label>
      <div className="flex items-center gap-3 sm:justify-end">
        <Notice state={state} />
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
