"use client";

import { useActionState } from "react";
import type { HeroSettings, MediaRef } from "@/lib/types";
import type { ActionResult } from "@/lib/server/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass, labelTextClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/styles";
import { ConfirmButton, MediaThumb, MoveButtons, Notice, SubmitButton } from "@/components/admin/ui";
import { fromLines, toLines, useSaveSection } from "@/components/admin/useSaveSection";
import { addHeroSlide, deleteHeroSlide, moveHeroSlide, replaceHeroSlideImage, updateHeroSlide } from "../content-actions";

export function HeroBrandForm({ initial }: { initial: HeroSettings }) {
  const { value, update, save, pending, result } = useSaveSection("hero", initial);
  const video = value.backgroundVideo;

  return (
    <section className={`${cardClass} space-y-5 p-5`}>
      <h2 className="font-display text-2xl font-semibold text-(--brand-wood)">Brand text and background</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelTextClass}>Small line above the headline</span>
          <input value={value.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} maxLength={120} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelTextClass}>Headline</span>
          <input value={value.headline} onChange={(e) => update({ headline: e.target.value })} maxLength={120} className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className={labelTextClass}>Lines under the headline (one per line, up to 4)</span>
        <textarea
          defaultValue={toLines(value.sublines)}
          onChange={(e) => update({ sublines: fromLines(e.target.value) })}
          rows={3}
          className={inputClass}
        />
      </label>

      <div>
        <span className={labelTextClass}>Background video</span>
        <div className="flex flex-wrap items-center gap-4">
          {video ? <MediaThumb media={video} size={96} /> : <p className="text-sm text-(--text-subtle)">None: the first slide&apos;s photo is used.</p>}
          <MediaUploader folder="hero" accept="video/*" label={video ? "Replace video" : "Upload video"} onUploaded={(m) => update({ backgroundVideo: m })} />
          {video && (
            <button type="button" className={secondaryButtonClass} onClick={() => update({ backgroundVideo: null })}>
              Remove video
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-(--text-subtle)">A new video takes effect when you press Save.</p>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={save} disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Notice state={result} />
      </div>
    </section>
  );
}

type Slide = {
  id: number;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  tag: string;
  categoryId: number | null;
  visible: boolean;
  image: MediaRef;
  locked: boolean;
};

export function HeroSlides({ slides, categories }: { slides: Slide[]; categories: { id: number; label: string }[] }) {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-(--brand-wood)">Slides</h2>
          <p className="mt-1 text-sm text-(--text-muted)">Shown in the arch frame, changing every few seconds. New slides start hidden.</p>
        </div>
        <MediaUploader folder="hero" accept="image/*" label="Add a slide (photo)" onUploaded={(m) => addHeroSlide(m)} />
      </div>
      <ul className="mt-4 space-y-3">
        {slides.map((s, i) => (
          <li key={s.id} className={`${cardClass} flex flex-col gap-4 p-4 lg:flex-row`}>
            <div className="flex items-start gap-3">
              <MoveButtons onUp={moveHeroSlide.bind(null, s.id, "up")} onDown={moveHeroSlide.bind(null, s.id, "down")} first={i === 0} last={i === slides.length - 1} />
              <div className="space-y-2">
                <MediaThumb media={s.image} size={110} alt={s.name} />
                <MediaUploader folder="hero" accept="image/*" label="Replace" onUploaded={(m) => replaceHeroSlideImage(s.id, m)} />
              </div>
            </div>
            <SlideForm slide={s} categories={categories} />
            <div className="lg:self-start">
              {s.locked ? (
                <p className="max-w-36 text-xs text-(--text-subtle)">The only visible slide, so it can&apos;t be deleted.</p>
              ) : (
                <ConfirmButton action={deleteHeroSlide.bind(null, s.id)} confirmText={`Delete the slide "${s.name}"?`}>
                  Delete
                </ConfirmButton>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SlideForm({ slide, categories }: { slide: Slide; categories: { id: number; label: string }[] }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateHeroSlide.bind(null, slide.id), {});
  return (
    <form action={action} className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
      <label className="block">
        <span className={labelTextClass}>Name (used in the quote list)</span>
        <input name="name" defaultValue={slide.name} required maxLength={80} className={inputClass} />
      </label>
      <label className="block">
        <span className={labelTextClass}>Label above the text</span>
        <input name="eyebrow" defaultValue={slide.eyebrow} maxLength={60} className={inputClass} />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelTextClass}>Headline</span>
        <input name="title" defaultValue={slide.title} required maxLength={160} className={inputClass} />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelTextClass}>Description</span>
        <textarea name="description" defaultValue={slide.description} rows={2} maxLength={400} className={inputClass} />
      </label>
      <label className="block">
        <span className={labelTextClass}>Tag on the photo</span>
        <input name="tag" defaultValue={slide.tag} maxLength={40} className={inputClass} />
      </label>
      <label className="block">
        <span className={labelTextClass}>Category (optional)</span>
        <select name="categoryId" defaultValue={slide.categoryId ?? ""} className={inputClass}>
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-(--text-muted)">
        <input type="checkbox" name="visible" defaultChecked={slide.visible} disabled={slide.locked} className="h-4 w-4 accent-(--brand-wood)" />
        Visible on the website
        {/* A disabled checkbox isn't submitted, so send the value explicitly. */}
        {slide.locked && <input type="hidden" name="visible" value="on" />}
      </label>
      <div className="flex items-center gap-3 sm:justify-end">
        <Notice state={state} />
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
