import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHeader } from "../../components/ui/PageHeader";
import { Reveal } from "../../components/ui/Reveal";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { siteConfig } from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call or message TM Artisan Enterprise in Gosa, Airport Road, Abuja.",
};

// +2349168549455 -> 0916 854 9455
const showPhone = (p: string) =>
  p.replace(/^\+234(\d{3})(\d{3})(\d{4})$/, "0$1 $2 $3");

const query = encodeURIComponent("Gosa, Airport Road, Abuja");

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Talk to us, or come and see the work."
        intro="WhatsApp is the quickest way to reach us. You can also call, email or visit the workshop."
        variant="orbit"
      />

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="amber" tone="light" className="opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:pb-28">
          <Reveal>
            <dl className="space-y-8">
              <div>
                <dt className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
                  <MapPin size={15} /> Address
                </dt>
                <dd className="mt-1.5 font-display text-2xl leading-snug text-[var(--brand-wood)]">
                  {siteConfig.address}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
                  <Phone size={15} /> Call
                </dt>
                <dd className="mt-1.5 space-y-1 font-display text-2xl text-[var(--brand-wood)]">
                  {siteConfig.phones.map((p) => (
                    <div key={p}>
                      <a href={`tel:${p}`} className="transition hover:text-[var(--brand-gold-deep)]">
                        {showPhone(p)}
                      </a>
                    </div>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
                  <Mail size={15} /> Email
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-[var(--brand-wood)]">
                  <a href={`mailto:${siteConfig.email}`} className="break-all transition hover:text-[var(--brand-gold-deep)]">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>

            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
            >
              <FaWhatsapp size={18} />
              Message us on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--brand-cream)]">
              <iframe
                title="Map of Gosa, Airport Road, Abuja"
                src={`https://www.google.com/maps?q=${query}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full lg:aspect-auto lg:h-[30rem]"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex text-sm font-medium text-[var(--brand-wood)]"
            >
              <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                Open in Google Maps
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}