"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";

const navItems = ["Craftsmanship", "Collections", "Projects", "About"];

const featureCards = [
  {
    title: "Premium hardwood",
    text: "Solid wood selections with handcrafted finishes designed to age beautifully.",
  },
  {
    title: "Custom design",
    text: "Tailored silhouettes and dimensions for homes, offices, and luxury interiors.",
  },
  {
    title: "Made to last",
    text: "Built with meticulous detailing and durable craftsmanship for everyday elegance.",
  },
];

const galleryImages = [
  "/f1.png",
  "/f2.png",
  "/f3.png",
  "/f4.png",
  "/f5.png",
  "/f6.png",
  "/f7.png",
  "/f8.png",
  "/f9.png",
  "/f10.png",
  "/f11.png",
  "/f12.png",
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = initialTheme;

    const loaderTimer = setTimeout(() => setIsLoading(false), 1400);
    const toastTimer = setTimeout(() => setShowToast(true), 1700);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(toastTimer);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(32,22,18,0.72)] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-20 w-20 rounded-full border-[6px] border-[rgba(255,255,255,0.2)] border-t-[var(--brand-gold)] animate-spin" />
            <div className="text-sm font-medium tracking-[0.25em] text-[var(--brand-gold)] uppercase">
              Loading
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-40 flex w-[min(360px,calc(100vw-2rem))] items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-toast)] p-4 shadow-[0_20px_50px_rgba(34,22,18,0.18)] backdrop-blur-md"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,166,106,0.15)] text-[var(--brand-gold-deep)]">
              <FaWhatsapp className="text-xl" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--brand-wood-deep)]">Quick chat</div>
              <div className="text-xs text-[var(--text-subtle)]">Talk to us on WhatsApp</div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close notification"
            onClick={() => setShowToast(false)}
            className="text-lg text-[var(--text-subtle)] transition hover:text-[var(--brand-wood)]"
          >
            ×
          </button>
        </div>
      )}

      <a
        href="https://wa.me/2348057789650"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-[0_12px_30px_rgba(37,211,102,0.5)] transition hover:scale-105 hover:shadow-[0_18px_38px_rgba(37,211,102,0.65)]"
      >
        <FaWhatsapp />
      </a>

      <main className="min-h-screen bg-[var(--brand-ivory)] text-[var(--brand-charcoal)]">
        <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-header)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-sm">
                <Image
                  src="/TM-logo.jpeg"
                  alt="TM Artisan Enterprise logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--brand-gold-deep)]">
                  Artisan
                </div>
                <div className="text-xl font-semibold tracking-tight text-[var(--brand-wood)]">
                  TM Enterprise
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--brand-wood)] md:flex">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-[var(--brand-gold-deep)]">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="rounded-full bg-[var(--brand-wood)] px-5 py-2.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)]"
              >
                Book a consultation
              </a>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle light and dark theme"
                title="Toggle light and dark theme"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-faint)] text-[var(--brand-wood)] transition hover:bg-[var(--surface-strong)]"
              >
                <Moon className="theme-toggle-moon" size={18} />
                <Sun className="theme-toggle-sun" size={18} />
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold-deep)]">
              Handcrafted elegance
            </span>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-wood-deep)] sm:text-5xl lg:text-6xl">
              Statement furniture with a warm, timeless soul.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--text-muted)]">
              TM Artisan Enterprise creates bespoke wood furniture that blends heritage craftsmanship,
              premium materials, and a refined modern aesthetic for homes and luxury interiors.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#collections"
                className="rounded-full bg-[var(--brand-gold)] px-6 py-3 text-center text-sm font-semibold text-[var(--brand-wood-deep)] transition hover:bg-[var(--brand-gold-deep)]"
              >
                Explore collections
              </a>
              <a
                href="#about"
                className="rounded-full border border-[var(--border-subtle)] bg-transparent px-6 py-3 text-center text-sm font-semibold text-[var(--brand-wood)] transition hover:border-[var(--brand-wood)] hover:bg-[var(--surface-faint)]"
              >
                Our story
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-sm text-[var(--text-muted)]">
              <div>
                <div className="text-3xl font-bold text-[var(--brand-wood)]">12+</div>
                <div>Years of craftsmanship</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--brand-wood)]">500+</div>
                <div>Custom pieces delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--brand-wood)]">100%</div>
                <div>Built with care</div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-[2rem] bg-[radial-gradient(circle,_rgba(201,166,106,0.28),_transparent_60%)] blur-2xl" />
            <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(145deg,var(--hero-panel-start),var(--hero-panel-end))] p-6 shadow-[0_30px_80px_rgba(77,45,36,0.16)]">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--brand-ivory)] p-5">
                <div className="overflow-hidden rounded-[1.25rem] bg-[var(--brand-ivory)]">
                  <Image
                    src="/TM-logo.jpeg"
                    alt="TM Artisan chair showcase"
                    width={1200}
                    height={1000}
                    className="h-[520px] w-full rounded-[1rem] object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="collections" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold-deep)]">
                Our focus
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--brand-wood-deep)]">
                Designed for refined living.
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm"
              >
                <div className="mb-5 h-12 w-12 rounded-full bg-[rgba(201,166,106,0.16)]" />
                <h3 className="text-xl font-semibold text-[var(--brand-wood-deep)]">{card.title}</h3>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold-deep)]">
              Gallery
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--brand-wood-deep)]">
              A closer look at our craft.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galleryImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-sm"
              >
                <div className="relative h-28 w-full sm:h-32">
                  <Image
                    src={image}
                    alt={`TM furniture piece ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="bg-[var(--about-surface)] py-16 text-[var(--about-text)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Why TM
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Luxury that feels deeply personal.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-[var(--about-text)] opacity-90">
              <p>
                Every piece is thoughtfully built to celebrate real materials, rich textures, and the
                comfort of everyday use. We believe furniture should not just fill a room — it should
                define the character of the space.
              </p>
              <p>
                From statement chairs to custom interiors, our team blends traditional woodwork with a
                contemporary aesthetic, creating timeless pieces for homes, hospitality projects, and
                modern offices.
              </p>
            </div>
          </div>
        </section>

        <footer id="contact" className="border-t border-[var(--border-subtle)] bg-[var(--surface-faint)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-strong)]">
                <Image
                  src="/TM-logo.jpeg"
                  alt="TM Artisan Enterprise logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold-deep)]">
                  TM
                </div>
                <div className="text-lg font-semibold text-[var(--brand-wood)]">Artisan Enterprise</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-[var(--brand-wood)]">
              <a href="#" className="transition hover:text-[var(--brand-gold-deep)]">Collections</a>
              <a href="#" className="transition hover:text-[var(--brand-gold-deep)]">Projects</a>
              <a href="#" className="transition hover:text-[var(--brand-gold-deep)]">Journal</a>
              <a href="#" className="transition hover:text-[var(--brand-gold-deep)]">Contact</a>
            </div>

            <div className="text-sm text-[var(--text-subtle)]">hello@tmartisan.com</div>
          </div>
        </footer>
      </main>
    </>
  );
}
