"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { activeCategories, siteConfig } from "../../lib/data";
import { whatsappUrl } from "../../lib/whatsapp";

const field =
  "w-full rounded-xl border border-[rgba(77,45,36,0.25)] bg-transparent px-4 py-3 text-sm text-(--brand-wood) placeholder:text-(--text-subtle) focus:border-(--brand-gold) focus:outline-none focus:ring-2 focus:ring-(--brand-gold)/40";

export function CustomRequestForm() {
  const [piece, setPiece] = useState("");
  const [size, setSize] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");

  const ready = details.trim().length > 0;

  const text = [
    `Hello ${siteConfig.shortName}, I'd like a custom piece.`,
    "",
    `Piece: ${piece || "Not sure yet"}`,
    size.trim() && `Size: ${size.trim()}`,
    `Details: ${details.trim()}`,
    name.trim() && `Name: ${name.trim()}`,
    "",
    "I will send photos or drawings in this chat.",
  ]
    .filter((line): line is string => typeof line === "string" && line.length > 0)
    .join("\n");

  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    "Custom piece request",
  )}&body=${encodeURIComponent(text)}`;

  const disabled = !ready && "pointer-events-none opacity-50";

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-(--text-muted)">What are you after?</span>
        <select value={piece} onChange={(e) => setPiece(e.target.value)} className={field}>
          <option value="" className="bg-(--brand-ivory)">Not sure yet</option>
          {activeCategories.map((c) => (
            <option key={c.slug} value={c.label} className="bg-(--brand-ivory)">
              {c.label}
            </option>
          ))}
          <option value="Something else" className="bg-(--brand-ivory)">Something else</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-(--text-muted)">Size, if you know it</span>
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="For example 3m wide by 2.4m high"
          className={field}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-(--text-muted)">Describe it</span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          placeholder="Colours, finish, where it goes, anything you have in mind"
          className={field}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-(--text-muted)">Your name (optional)</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </label>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
        <a
          href={whatsappUrl(text)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          tabIndex={ready ? 0 : -1}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-(--brand-wood) px-6 py-3 text-sm font-medium text-(--brand-ivory) transition hover:bg-(--brand-wood-deep) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-gold) focus-visible:ring-offset-2",
            disabled,
          )}
        >
          <FaWhatsapp size={17} />
          Send on WhatsApp
        </a>
        <a
          href={mailto}
          aria-disabled={!ready}
          tabIndex={ready ? 0 : -1}
          className={cn(
            "group inline-flex items-center gap-2 text-sm font-medium text-(--brand-wood)",
            disabled,
          )}
        >
          <Mail size={16} />
          <span className="border-b border-(--brand-gold) pb-0.5 transition group-hover:border-(--brand-wood)">
            Send by email
          </span>
        </a>
      </div>
    </div>
  );
}