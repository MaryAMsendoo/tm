"use client";

import { useActionState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass } from "@/components/admin/styles";
import { ConfirmButton, MediaThumb, MoveButtons, Notice, SubmitButton } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/server/admin";
import { addProductMedia, deleteProductMedia, moveProductMedia, updateProductMedia } from "../actions";

type Item = {
  id: number;
  kind: "image" | "video";
  url: string;
  posterUrl: string | null;
  title: string;
  description: string;
};

export function MediaManager({ productId, productName, media }: { productId: number; productName: string; media: Item[] }) {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-(--brand-wood)">Photos and videos ({media.length})</h2>
          <p className="mt-1 text-sm text-(--text-muted)">
            The first photo is the shop card image. Every item also appears in the showroom gallery. Photos up to 10 MB, videos up to 100 MB.
          </p>
        </div>
        <MediaUploader
          folder="products"
          multiple
          label="Upload photos or videos"
          onUploaded={(m) => addProductMedia(productId, m)}
        />
      </div>

      {media.length === 0 ? (
        <p className={`${cardClass} mt-4 p-8 text-center text-sm text-(--text-muted)`}>
          No photos yet. A product needs at least one photo to appear in the shop.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {media.map((m, i) => (
            <li key={m.id} className={`${cardClass} flex flex-col gap-4 p-4 sm:flex-row`}>
              <div className="flex items-start gap-3">
                <MoveButtons
                  onUp={moveProductMedia.bind(null, m.id, productId, "up")}
                  onDown={moveProductMedia.bind(null, m.id, productId, "down")}
                  first={i === 0}
                  last={i === media.length - 1}
                />
                <a href={m.url} target="_blank" rel="noopener noreferrer" title="Open full size">
                  <MediaThumb media={m} size={96} alt={m.title || productName} />
                </a>
              </div>
              <CaptionForm item={m} productName={productName} />
              <div className="sm:self-start">
                <ConfirmButton
                  action={deleteProductMedia.bind(null, m.id, productId)}
                  confirmText={`Remove this ${m.kind === "video" ? "video" : "photo"} from the website?`}
                >
                  Remove
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CaptionForm({ item, productName }: { item: Item; productName: string }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateProductMedia.bind(null, item.id), {});
  return (
    <form action={action} className="min-w-0 flex-1 space-y-2">
      <input
        name="title"
        defaultValue={item.title}
        maxLength={120}
        placeholder={`Caption (optional, defaults to “${productName}”)`}
        aria-label="Caption"
        className={inputClass}
      />
      <textarea
        name="description"
        defaultValue={item.description}
        maxLength={1000}
        rows={2}
        placeholder="Text under the photo in the showroom (optional, defaults to the product description)"
        aria-label="Description"
        className={inputClass}
      />
      <div className="flex items-center gap-3">
        <SubmitButton>Save caption</SubmitButton>
        <Notice state={state} />
      </div>
    </form>
  );
}
