"use client";

import { useActionState, useEffect, useRef } from "react";
import type { MediaRef } from "@/lib/types";
import type { ActionResult } from "@/lib/server/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass, labelTextClass, secondaryButtonClass } from "@/components/admin/styles";
import { ConfirmButton, MediaThumb, MoveButtons, Notice, SubmitButton } from "@/components/admin/ui";
import {
  createTestimonial,
  deleteTestimonial,
  moveTestimonial,
  setTestimonialAvatar,
  updateTestimonial,
} from "../content-actions";

type Item = { id: number; quote: string; name: string; detail: string; visible: boolean; avatar: MediaRef | null };

export function TestimonialsAdmin({ items }: { items: Item[] }) {
  return (
    <>
      <details className={`${cardClass} p-4`}>
        <summary className="cursor-pointer text-sm font-medium text-(--brand-wood)">Add a testimonial</summary>
        <TestimonialForm action={createTestimonial} submitLabel="Add testimonial" resetOnSuccess />
      </details>

      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li key={item.id} className={`${cardClass} flex flex-col gap-4 p-4 sm:flex-row`}>
            <div className="flex items-start gap-3">
              <MoveButtons
                onUp={moveTestimonial.bind(null, item.id, "up")}
                onDown={moveTestimonial.bind(null, item.id, "down")}
                first={i === 0}
                last={i === items.length - 1}
              />
              <div className="space-y-2">
                {item.avatar ? (
                  <MediaThumb media={item.avatar} size={64} alt={item.name} />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-(--brand-cream) text-xs text-(--text-subtle)">No photo</div>
                )}
                <MediaUploader folder="testimonials" accept="image/*" label={item.avatar ? "Change" : "Add photo"} onUploaded={(m) => setTestimonialAvatar(item.id, m)} />
                {item.avatar && (
                  <form action={setTestimonialAvatar.bind(null, item.id, null)}>
                    <button type="submit" className={`${secondaryButtonClass} px-3 py-1 text-xs`}>
                      Remove photo
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <TestimonialForm action={updateTestimonial.bind(null, item.id)} values={item} submitLabel="Save" />
            </div>
            <div className="sm:self-start">
              <ConfirmButton action={deleteTestimonial.bind(null, item.id)} confirmText={`Delete ${item.name}'s testimonial?`}>
                Delete
              </ConfirmButton>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function TestimonialForm({
  action: serverAction,
  values,
  submitLabel,
  resetOnSuccess,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  values?: Item;
  submitLabel: string;
  resetOnSuccess?: boolean;
}) {
  const [state, action] = useActionState<ActionResult, FormData>(serverAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  // Clear the "add" form after a successful save.
  useEffect(() => {
    if (resetOnSuccess && state.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={formRef} action={action} className="mt-3 space-y-3">
      <label className="block">
        <span className={labelTextClass}>Quote</span>
        <textarea name="quote" defaultValue={values?.quote} required rows={3} maxLength={1500} className={inputClass} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelTextClass}>Client name</span>
          <input name="name" defaultValue={values?.name} required maxLength={80} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelTextClass}>What was made, where (optional)</span>
          <input name="detail" defaultValue={values?.detail} maxLength={160} placeholder="e.g. Kitchen cabinets, Gwarinpa" className={inputClass} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-(--text-muted)">
          <input type="checkbox" name="visible" defaultChecked={values?.visible ?? true} className="h-4 w-4 accent-(--brand-wood)" />
          Visible on the website
        </label>
        <SubmitButton>{submitLabel}</SubmitButton>
        <Notice state={state} />
      </div>
    </form>
  );
}
