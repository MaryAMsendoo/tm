"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Trash2, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useEnquiry } from "../../context/EnquiryContext";
import { enquiryEmailUrl, enquiryWhatsappUrl } from "../../lib/whatsapp";

export function EnquiryDrawer() {
  const { items, count, isOpen, close, remove, clear } = useEnquiry();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        />
      )}
      {isOpen && (
        <motion.aside
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry list"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
          className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-md flex-col bg-[var(--background)] shadow-2xl"
        >
          <div className="flex items-start justify-between border-b border-[var(--border-subtle)] px-6 py-5">
            <div>
              <h2 className="font-display text-3xl font-semibold text-[var(--brand-wood)]">
                Your enquiry list
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {count === 0
                  ? "Nothing added yet."
                  : `${count} piece${count === 1 ? "" : "s"} to price.`}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close enquiry list"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {count === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="max-w-xs font-display text-2xl text-[var(--brand-wood)]">
                  Add the pieces you like and we'll price them together.
                </p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--brand-wood)] px-6 py-3 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)]"
                >
                  Browse the collection
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--brand-cream)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[var(--foreground)]">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="mt-0.5 text-sm text-[var(--text-subtle)]">
                            {item.category}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-[var(--brand-gold-deep)]">
                          Price on request
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-subtle)] transition hover:bg-[rgba(77,45,36,0.08)] hover:text-[var(--brand-wood)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {count > 0 && (
            <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-faint)] px-6 py-5">
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Every piece is quoted to your size and finish. Send the list
                and we'll reply with prices.
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href={enquiryWhatsappUrl(items)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-medium text-[var(--brand-wood-deep)] shadow-[0_10px_25px_rgba(201,166,106,0.25)] transition hover:bg-[var(--brand-gold-deep)]"
                >
                  <FaWhatsapp size={18} />
                  Send on WhatsApp
                </a>
                <a
                  href={enquiryEmailUrl(items)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(77,45,36,0.25)] px-5 py-3 text-sm font-medium text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.04)]"
                >
                  <Mail size={17} />
                  Send by email
                </a>
                <button
                  type="button"
                  onClick={clear}
                  className="mt-1 text-sm text-[var(--text-subtle)] underline-offset-4 transition hover:text-[var(--brand-wood)] hover:underline"
                >
                  Clear list
                </button>
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}