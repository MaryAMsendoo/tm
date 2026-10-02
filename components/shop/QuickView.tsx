"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { categories, type Product } from "../../lib/data";
import { productWhatsappUrl } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { has, toggle } = useEnquiry();
  const [active, setActive] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset the gallery for each product.
  useEffect(() => setActive(0), [product?.id]);

  // Escape to close, lock page scroll while open, focus the close button.
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  const categoryLabel = product
    ? categories.find((c) => c.slug === product.category)?.label
    : undefined;
  const added = product ? has(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="quickview"
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close quick view"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--brand-wood-deep)]/60 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-[var(--brand-ivory)] sm:rounded-3xl md:grid-cols-2"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-toast)] text-[var(--brand-wood)] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            >
              <X size={18} />
            </button>

            {/* Images */}
            <div className="bg-[var(--brand-cream)]">
              <div className="relative aspect-[4/5] w-full md:h-full md:min-h-[32rem] md:aspect-auto">
                <Image
                  key={product.images[active]}
                  src={product.images[active]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 440px, 100vw"
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show image ${i + 1}`}
                      aria-current={i === active}
                      className={cn(
                        "relative h-16 w-14 overflow-hidden rounded-lg border-2 transition",
                        i === active
                          ? "border-[var(--brand-gold)]"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col p-6 sm:p-8">
              {categoryLabel && (
                <p className="text-sm text-[var(--text-subtle)]">{categoryLabel}</p>
              )}
              <h2 className="mt-1 pr-10 font-display text-3xl font-medium leading-tight text-[var(--brand-wood)] sm:text-4xl">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">Price on request</p>

              <p className="mt-5 text-base leading-7 text-[var(--text-muted)]">
                {product.description}
              </p>

              {(product.dimensions || product.materials) && (
                <dl className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-5 text-sm">
                  {product.dimensions && (
                    <div className="flex gap-3">
                      <dt className="w-24 shrink-0 text-[var(--text-subtle)]">Size</dt>
                      <dd className="text-[var(--brand-wood)]">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.materials && (
                    <div className="flex gap-3">
                      <dt className="w-24 shrink-0 text-[var(--text-subtle)]">Materials</dt>
                      <dd className="text-[var(--brand-wood)]">{product.materials}</dd>
                    </div>
                  )}
                </dl>
              )}

              {product.customisable && (
                <p className="mt-5 text-sm leading-6 text-[var(--text-muted)]">
                  Can be made to your size, colour and finish. Tell us what you
                  want when you send your enquiry.
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                <button
                  type="button"
                  aria-pressed={added}
                  onClick={() =>
                    toggle({
                      id: product.id,
                      name: product.name,
                      image: product.images[0],
                      category: categoryLabel,
                    })
                  }
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2",
                    added
                      ? "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)]"
                      : "bg-[var(--brand-wood)] text-[var(--brand-ivory)] hover:bg-[var(--brand-wood-deep)]",
                  )}
                >
                  {added ? <Check size={16} /> : <Plus size={16} />}
                  {added ? "Added to enquiry" : "Add to enquiry"}
                </button>

                <a
                  href={productWhatsappUrl({ name: product.name, category: categoryLabel })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-wood)]"
                >
                  <FaWhatsapp size={17} />
                  <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                    Ask on WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}