import type { Metadata } from "next";
import Image from "next/image";
import { BRAND_LOGO } from "@/lib/brand";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src={BRAND_LOGO}
            alt="TM Artisan logo"
            width={64}
            height={64}
            priority
            className="h-16 w-16 rounded-full object-cover ring-1 ring-[var(--brand-gold)]"
          />
          <h1 className="mt-5 font-display text-3xl font-semibold text-[var(--brand-wood)]">Admin dashboard</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Sign in to manage the website and requests.</p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-xs leading-5 text-[var(--text-subtle)]">
          Forgot your password? Ask your developer to reset it.
        </p>
      </div>
    </main>
  );
}
