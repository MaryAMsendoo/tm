"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import type { Product } from "../../lib/types";
import { productEnquiryText } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";
import { useRequest } from "../../context/RequestContext";
import { useCategoryLabel, useSite } from "../../context/SiteContext";
import { imageUrl } from "../../lib/media";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { has, toggle } = useEnquiry();
  const added = has(product.id);
  const site = useSite();
  const { request } = useRequest();
  const categoryLabel = useCategoryLabel(product.category);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 30vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`Quick view: ${product.name}`}
            className="absolute inset-0 flex items-end justify-center pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-gold)]"
          >
            <span className="rounded-full bg-[var(--surface-toast)] px-3.5 py-1.5 text-xs font-medium text-[var(--brand-wood)] backdrop-blur-md transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              Quick view
            </span>
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-display text-xl font-medium leading-snug text-[var(--brand-wood)] sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-0.5 text-sm text-[var(--text-subtle)]">
          Price on request
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5">
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
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2",
              added
                ? "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)]"
                : "bg-[var(--brand-wood)] text-[var(--brand-ivory)] hover:bg-[var(--brand-wood-deep)]",
            )}
          >
            {added ? <Check size={15} /> : <Plus size={15} />}
            {added ? "Added" : "Add to enquiry"}
          </button>

          <button
            type="button"
            onClick={() =>
              request({
                channel: "whatsapp",
                kind: "single_item",
                items: [{ id: product.id, name: product.name, category: categoryLabel, image: imageUrl(product.images[0], 800) }],
                message: productEnquiryText(site, { name: product.name, category: categoryLabel }),
              })
            }
            className="group/wa inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-wood)]"
          >
            <FaWhatsapp size={16} />
            <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover/wa:border-[var(--brand-wood)]">
              Ask on WhatsApp
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}