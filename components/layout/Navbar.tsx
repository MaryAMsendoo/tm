"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ClipboardList, MapPin, Menu, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { navLinks, siteConfig } from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { count, open } = useEnquiry();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top bar: scrolls away, the main bar below stays */}
      <div className="hidden bg-[var(--brand-wood-deep)] text-[var(--brand-ivory)] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 text-xs">
          <span className="flex items-center gap-2">
            <MapPin size={13} className="text-[var(--brand-gold)]" />
            {siteConfig.address}
          </span>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phones[0]}`}
              className="flex items-center gap-2 transition hover:text-[var(--brand-gold)]"
            >
              <Phone size={13} className="text-[var(--brand-gold)]" />
              {siteConfig.phones[0]}
            </a>
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-[var(--brand-gold)]"
            >
              <FaWhatsapp size={14} className="text-[var(--brand-gold)]" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-[var(--surface-header)] backdrop-blur-xl transition-shadow duration-300",
          scrolled
            ? "border-[var(--border-subtle)] shadow-[0_8px_30px_rgba(47,27,22,0.08)]"
            : "border-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-[height] duration-300 lg:px-8",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} logo`}
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-full object-cover ring-1 ring-[var(--brand-gold)]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm transition-colors",
                  isActive(link.href)
                    ? "text-[var(--brand-wood)]"
                    : "text-[var(--text-muted)] hover:text-[var(--brand-wood)]",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[var(--brand-gold)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            <button
              type="button"
              onClick={open}
              aria-label={`Open enquiry list, ${count} item${count === 1 ? "" : "s"}`}
              className="relative inline-flex items-center gap-2 rounded-full border border-[rgba(77,45,36,0.25)] px-3.5 py-2.5 text-sm font-medium text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Enquiry list</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-gold)] px-1 text-[11px] font-semibold text-[var(--brand-wood-deep)]"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] lg:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--background)] lg:hidden"
            >
              <nav
                className="mx-auto flex max-w-7xl flex-col px-5 py-4"
                aria-label="Mobile"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-[var(--border-subtle)] py-3.5 font-display text-2xl transition-colors",
                      isActive(link.href)
                        ? "text-[var(--brand-gold-deep)]"
                        : "text-[var(--brand-wood)]",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={generalWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-medium text-[var(--brand-wood-deep)] transition hover:bg-[var(--brand-gold-deep)]"
                >
                  <FaWhatsapp size={18} />
                  Chat on WhatsApp
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}