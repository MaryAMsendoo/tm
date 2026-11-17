"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Film } from "lucide-react";
import type { MediaRef } from "@/lib/types";
import { dangerButtonClass, primaryButtonClass } from "./styles";

export function PageTitle({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-semibold text-(--brand-wood)">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-muted)">{intro}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/** Submit button that shows progress while its form's action runs. */
export function SubmitButton({ children, className = primaryButtonClass }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Saving..." : children}
    </button>
  );
}

/** Result line under a form. */
export function Notice({ state }: { state: { ok?: boolean; error?: string; message?: string } }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-[#a5432f]">
        {state.error}
      </p>
    );
  }
  if (state.ok) return <p className="text-sm text-[#2f6b3f]">{state.message ?? "Saved."}</p>;
  return null;
}

/** A one-button form for a destructive action, with a confirmation prompt. */
export function ConfirmButton({
  action,
  confirmText,
  children,
  className = dangerButtonClass,
}: {
  action: () => void | Promise<void>;
  confirmText: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <SubmitButton className={className}>{children}</SubmitButton>
    </form>
  );
}

/** Up / down buttons that call server actions. */
export function MoveButtons({ onUp, onDown, first, last }: { onUp: () => Promise<void>; onDown: () => Promise<void>; first: boolean; last: boolean }) {
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--brand-wood) transition hover:bg-[rgba(77,45,36,0.06)] disabled:opacity-30";
  return (
    <div className="flex gap-1">
      <form action={onUp}>
        <button type="submit" className={btn} disabled={first} aria-label="Move up">
          <ArrowUp size={14} />
        </button>
      </form>
      <form action={onDown}>
        <button type="submit" className={btn} disabled={last} aria-label="Move down">
          <ArrowDown size={14} />
        </button>
      </form>
    </div>
  );
}

/** Small preview of a photo or video. */
export function MediaThumb({ media, size = 64, alt = "" }: { media: Pick<MediaRef, "kind" | "url" | "posterUrl">; size?: number; alt?: string }) {
  const src = media.kind === "video" ? media.posterUrl : media.url;
  return (
    <div className="relative shrink-0 overflow-hidden rounded-lg bg-(--brand-cream)" style={{ width: size, height: size }}>
      {src && <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />}
      {media.kind === "video" && (
        <span className="absolute bottom-1 right-1 inline-flex items-center rounded bg-black/60 p-0.5 text-white">
          <Film size={12} />
        </span>
      )}
    </div>
  );
}

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-(--brand-wood)" />
      <span>
        <span className="block text-sm font-medium text-(--foreground)">{label}</span>
        {hint && <span className="block text-xs text-(--text-subtle)">{hint}</span>}
      </span>
    </label>
  );
}
