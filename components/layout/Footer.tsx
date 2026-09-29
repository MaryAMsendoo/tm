import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  categories,
  navLinks,
  siteConfig,
  type SocialKey,
} from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";

const socialIcons: Record<SocialKey, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const linkClass =
  "text-[var(--about-text)]/70 transition-colors hover:text-[var(--brand-gold)]";

export function Footer() {
  const socials = siteConfig.socials.filter((s) => s.href);

  return (
    <footer className="mt-24 bg-[var(--about-surface)] text-[var(--about-text)]">
      {/* Call-to-action band */}
      <div className="border-b border-[var(--about-text)]/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Have a piece in mind? We'll build it and send you a price.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--about-text)]/70">
              Share a photo, a size, or just an idea. Every piece is made to
              order, so there are no fixed prices.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-7 py-3.5 text-sm font-medium text-[#2f1b16] transition hover:bg-[var(--brand-gold-deep)]"
            >
              <FaWhatsapp size={18} />
              Chat on WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[var(--about-text)]/30 px-7 py-3.5 text-sm font-medium transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
            >
              Browse the collection
            </Link>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} logo`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--brand-gold)]"
            />
            <span className="font-display text-2xl font-semibold">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--about-text)]/70">
            {siteConfig.tagline}
          </p>

          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--about-text)]/25 transition hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h3 className="font-display text-xl font-semibold">Explore</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Collections">
          <h3 className="font-display text-xl font-semibold">Collections</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className={linkClass}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-xl font-semibold">Visit or call</h3>
          <ul className="mt-4 flex flex-col gap-3.5 text-sm text-[var(--about-text)]/70">
            <li className="flex gap-3">
              <MapPin
                size={17}
                className="mt-0.5 shrink-0 text-[var(--brand-gold)]"
              />
              <span>{siteConfig.address}</span>
            </li>
            {siteConfig.phones.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--brand-gold)]"
                />
                <a href={`tel:${phone}`} className={linkClass}>
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail
                size={17}
                className="mt-0.5 shrink-0 text-[var(--brand-gold)]"
              />
              <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--about-text)]/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-[var(--about-text)]/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>Made in Abuja, Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}