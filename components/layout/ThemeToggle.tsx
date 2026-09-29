"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("tm-theme", next);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
    >
      {/* The CSS in globals.css shows one of these depending on data-theme */}
      <Moon size={18} className="theme-toggle-moon" />
      <Sun size={18} className="theme-toggle-sun" />
    </button>
  );
}