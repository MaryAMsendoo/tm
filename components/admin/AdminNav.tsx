"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  FolderTree,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Presentation,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Requests", icon: Inbox },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/hero", label: "Home page hero", icon: Presentation },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="border-b border-[var(--border-subtle)] bg-[var(--surface-card)] lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="font-display text-2xl font-semibold text-[var(--brand-wood)]">
          TM Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.08)] lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={cn("flex-col px-3 pb-4 lg:flex lg:h-[calc(100dvh-5.5rem)]", open ? "flex" : "hidden")}>
        <nav aria-label="Admin" className="flex flex-col gap-0.5">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                isActive(href)
                  ? "bg-[var(--brand-wood)] text-[var(--brand-ivory)]"
                  : "text-[var(--text-muted)] hover:bg-[rgba(77,45,36,0.06)] hover:text-[var(--brand-wood)]",
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 lg:mt-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[rgba(77,45,36,0.06)] hover:text-[var(--brand-wood)]"
          >
            <ExternalLink size={17} />
            View the website
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[var(--text-muted)] hover:bg-[rgba(77,45,36,0.06)] hover:text-[var(--brand-wood)]"
            >
              <LogOut size={17} />
              Sign out <span className="truncate text-[var(--text-subtle)]">({username})</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
