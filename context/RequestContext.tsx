"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useSite } from "./SiteContext";
import { enquiryInputSchema, type EnquiryInput } from "../lib/enquiry-schema";
import { emailUrl, whatsappUrl } from "../lib/whatsapp";

/** A request the visitor is about to send. */
export type RequestDraft = {
  channel: EnquiryInput["channel"];
  kind: EnquiryInput["kind"];
  items?: EnquiryInput["items"];
  /** Message text that will open in WhatsApp or the email body. */
  message: string;
  /** Email subject (email channel only). */
  subject?: string;
};

type RequestContextValue = {
  /** Ask for name and phone, save the request, then open WhatsApp or email. */
  request: (draft: RequestDraft) => void;
};

const RequestContext = createContext<RequestContextValue | null>(null);
const CONTACT_KEY = "tm-contact";

function readContact(): { name: string; phone: string } {
  try {
    const raw = window.localStorage.getItem(CONTACT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { name: String(parsed.name ?? ""), phone: String(parsed.phone ?? "") };
    }
  } catch {
    // storage blocked or corrupt
  }
  return { name: "", phone: "" };
}

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<RequestDraft | null>(null);
  const request = useCallback((d: RequestDraft) => setDraft(d), []);
  const value = useMemo(() => ({ request }), [request]);

  return (
    <RequestContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {draft && <RequestDialog key="request" draft={draft} onClose={() => setDraft(null)} />}
      </AnimatePresence>
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error("useRequest must be used inside <RequestProvider>");
  return ctx;
}

const field =
  "w-full rounded-xl border border-[rgba(77,45,36,0.25)] bg-transparent px-4 py-3 text-sm text-[var(--brand-wood)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40";

function RequestDialog({ draft, onClose }: { draft: RequestDraft; onClose: () => void }) {
  const site = useSite();
  const [contact, setContact] = useState(readContact);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const isWhatsapp = draft.channel === "whatsapp";

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const message = `${draft.message}\n\nName: ${contact.name.trim()}\nPhone: ${contact.phone.trim()}`;
    const parsed = enquiryInputSchema.safeParse({
      name: contact.name,
      phone: contact.phone,
      channel: draft.channel,
      kind: draft.kind,
      items: draft.items ?? [],
      message,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    try {
      window.localStorage.setItem(CONTACT_KEY, JSON.stringify({ name: parsed.data.name, phone: parsed.data.phone }));
    } catch {
      // remembering the details is only a convenience
    }

    // Save in the background; keepalive lets it finish while WhatsApp opens.
    void fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      keepalive: true,
    }).catch(() => {});

    // Opened inside the click handler so browsers don't block it as a popup.
    if (isWhatsapp) {
      window.open(whatsappUrl(site, message), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = emailUrl(site, draft.subject ?? `Request from ${parsed.data.name}`, message);
    }
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--brand-wood-deep)]/70 backdrop-blur-sm"
      />
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        onSubmit={submit}
        noValidate
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-t-2xl bg-[var(--brand-ivory)] p-6 sm:rounded-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
        >
          <X size={18} />
        </button>

        <h2 id="request-title" className="pr-8 font-display text-3xl leading-tight text-[var(--brand-wood)]">
          {isWhatsapp ? "Before we open WhatsApp" : "Before we open your email"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Leave your name and number so we can get back to you, even if the message doesn&apos;t go through.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--text-muted)]">Your name</span>
            <input
              ref={nameRef}
              value={contact.name}
              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
              autoComplete="name"
              required
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--text-muted)]">Phone number</span>
            <input
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="For example 0803 123 4567"
              required
              className={field}
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#a5432f]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-wood)] px-6 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
        >
          {isWhatsapp ? <FaWhatsapp size={18} /> : <Mail size={17} />}
          {isWhatsapp ? "Continue to WhatsApp" : "Continue to email"}
        </button>
      </motion.form>
    </motion.div>
  );
}
