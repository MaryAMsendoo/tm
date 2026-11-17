"use client";

import { Plus, Trash2 } from "lucide-react";
import type { AboutSettings, FounderSettings, MediaRef, SiteSettings } from "@/lib/types";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { cardClass, inputClass, labelTextClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/styles";
import { MediaThumb, Notice } from "@/components/admin/ui";
import { fromLines, fromParagraphs, toLines, toParagraphs, useSaveSection } from "@/components/admin/useSaveSection";

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className={`${cardClass} space-y-5 p-5`}>
      <div>
        <h2 className="font-display text-2xl font-semibold text-(--brand-wood)">{title}</h2>
        {intro && <p className="mt-1 text-sm text-(--text-muted)">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelTextClass}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-(--text-subtle)">{hint}</span>}
    </label>
  );
}

function SaveBar({ save, pending, result }: { save: () => void; pending: boolean; result: { ok?: boolean; error?: string } }) {
  return (
    <div className="flex items-center gap-4 border-t border-(--border-subtle) pt-4">
      <button type="button" onClick={save} disabled={pending} className={primaryButtonClass}>
        {pending ? "Saving..." : "Save"}
      </button>
      <Notice state={result} />
    </div>
  );
}

function PhotoField({ label, media, onChange }: { label: string; media: MediaRef | null; onChange: (m: MediaRef | null) => void }) {
  return (
    <div>
      <span className={labelTextClass}>{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        {media ? <MediaThumb media={media} size={88} /> : <p className="text-sm text-(--text-subtle)">No photo.</p>}
        <MediaUploader folder="site" accept="image/*" label={media ? "Replace" : "Upload"} onUploaded={(m) => onChange(m)} />
        {media && (
          <button type="button" className={secondaryButtonClass} onClick={() => onChange(null)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ business details

export function SiteForm({ initial }: { initial: SiteSettings }) {
  const { value, update, save, pending, result } = useSaveSection("site", initial);
  return (
    <Section title="Business details" intro="Shown in the header, footer and Contact page. The WhatsApp number receives every request from the website.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name">
          <input value={value.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Short name" hint="Used in messages, e.g. “Hello TM Artisan, …”">
          <input value={value.shortName} onChange={(e) => update({ shortName: e.target.value })} className={inputClass} />
        </Field>
        <Field label="WhatsApp number" hint="Full international number, e.g. +2349168549455">
          <input value={value.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} inputMode="tel" className={inputClass} />
        </Field>
        <Field label="Email" hint="Leave empty to hide the email options.">
          <input value={value.email} onChange={(e) => update({ email: e.target.value })} type="email" className={inputClass} />
        </Field>
      </div>
      <Field label="Phone numbers (one per line)">
        <textarea defaultValue={toLines(value.phones)} onChange={(e) => update({ phones: fromLines(e.target.value) })} rows={2} className={inputClass} />
      </Field>
      <Field label="Address">
        <input value={value.address} onChange={(e) => update({ address: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Tagline (footer)">
        <input value={value.tagline} onChange={(e) => update({ tagline: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Description (shown by Google and when the link is shared)">
        <textarea value={value.description} onChange={(e) => update({ description: e.target.value })} rows={2} className={inputClass} />
      </Field>
      <div>
        <span className={labelTextClass}>Social media links (leave empty to hide)</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {value.socials.map((s, i) => (
            <label key={s.key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm text-(--text-muted)">{s.label}</span>
              <input
                value={s.href}
                onChange={(e) => update({ socials: value.socials.map((x, j) => (j === i ? { ...x, href: e.target.value.trim() } : x)) })}
                placeholder="https://"
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </div>
      <SaveBar save={save} pending={pending} result={result} />
    </Section>
  );
}

// ---------------------------------------------------------------- about page

export function AboutForm({ initial }: { initial: AboutSettings }) {
  const { value, update, save, pending, result } = useSaveSection("about", initial);
  const story = value.ourStory;
  const craft = value.craftsmanship;
  const setStory = (patch: Partial<AboutSettings["ourStory"]>) => update({ ourStory: { ...story, ...patch } });
  const setCraft = (patch: Partial<AboutSettings["craftsmanship"]>) => update({ craftsmanship: { ...craft, ...patch } });

  return (
    <Section title="About page" intro="Our story, mission, values and the approach to craftsmanship.">
      <PhotoField label="Photo beside “Our story”" media={story.photo} onChange={(photo) => setStory({ photo })} />
      <Field label="Opening line">
        <textarea value={story.lede} onChange={(e) => setStory({ lede: e.target.value })} rows={3} className={inputClass} />
      </Field>
      <Field label="Our story" hint="Leave an empty line between paragraphs.">
        <textarea defaultValue={toParagraphs(story.paragraphs)} onChange={(e) => setStory({ paragraphs: fromParagraphs(e.target.value) })} rows={10} className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Philosophy (highlighted quote)">
          <textarea value={story.philosophy} onChange={(e) => setStory({ philosophy: e.target.value })} rows={3} className={inputClass} />
        </Field>
        <Field label="Closing line">
          <textarea value={story.closing} onChange={(e) => setStory({ closing: e.target.value })} rows={3} className={inputClass} />
        </Field>
      </div>
      <Field label="Motto">
        <input value={story.motto} onChange={(e) => setStory({ motto: e.target.value })} className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mission">
          <textarea value={value.mission} onChange={(e) => update({ mission: e.target.value })} rows={3} className={inputClass} />
        </Field>
        <Field label="Vision">
          <textarea value={value.vision} onChange={(e) => update({ vision: e.target.value })} rows={3} className={inputClass} />
        </Field>
      </div>
      <Field label="Values (one per line)">
        <textarea defaultValue={toLines(value.values)} onChange={(e) => update({ values: fromLines(e.target.value) })} rows={5} className={inputClass} />
      </Field>

      <div className="space-y-4 rounded-xl bg-(--surface-faint) p-4">
        <Field label="Craftsmanship heading">
          <input value={craft.title} onChange={(e) => setCraft({ title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Craftsmanship introduction">
          <textarea value={craft.intro} onChange={(e) => setCraft({ intro: e.target.value })} rows={2} className={inputClass} />
        </Field>
        <span className={labelTextClass}>Points</span>
        {craft.points.map((p, i) => (
          <div key={i} className="flex gap-3">
            <div className="grid flex-1 gap-2">
              <input
                value={p.title}
                onChange={(e) => setCraft({ points: craft.points.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                placeholder="Title"
                aria-label={`Point ${i + 1} title`}
                className={inputClass}
              />
              <textarea
                value={p.text}
                onChange={(e) => setCraft({ points: craft.points.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                rows={2}
                placeholder="Text"
                aria-label={`Point ${i + 1} text`}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => setCraft({ points: craft.points.filter((_, j) => j !== i) })}
              aria-label={`Remove point ${i + 1}`}
              className="self-start rounded-full p-2 text-(--text-subtle) hover:bg-[rgba(77,45,36,0.08)] hover:text-[#a5432f]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCraft({ points: [...craft.points, { title: "", text: "" }] })}
          className={secondaryButtonClass}
        >
          <Plus size={16} /> Add a point
        </button>
      </div>
      <SaveBar save={save} pending={pending} result={result} />
    </Section>
  );
}

// ------------------------------------------------------------- founder message

export function FounderForm({ initial }: { initial: FounderSettings }) {
  const { value, update, save, pending, result } = useSaveSection("founder", initial);
  return (
    <Section title="Founder and CEO message" intro="The personal letter on the About page.">
      <div className="grid gap-5 sm:grid-cols-2">
        <PhotoField label="Main photo" media={value.photo} onChange={(photo) => update({ photo })} />
        <PhotoField label="Small round portrait beside the name" media={value.portrait} onChange={(portrait) => update({ portrait })} />
      </div>
      <Field label="Heading">
        <input value={value.title} onChange={(e) => update({ title: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Message" hint="Leave an empty line between paragraphs.">
        <textarea defaultValue={toParagraphs(value.paragraphs)} onChange={(e) => update({ paragraphs: fromParagraphs(e.target.value) })} rows={8} className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input value={value.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Role">
          <input value={value.role} onChange={(e) => update({ role: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Company">
          <input value={value.company} onChange={(e) => update({ company: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Sign-off">
          <input value={value.sign} onChange={(e) => update({ sign: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <SaveBar save={save} pending={pending} result={result} />
    </Section>
  );
}
