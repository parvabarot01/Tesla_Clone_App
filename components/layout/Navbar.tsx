import Link from "next/link";
import { CircleHelp, Globe, Menu, UserCircle } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href={ROUTES.home}
          className="text-sm font-semibold tracking-[0.35em] text-neutral-950 transition-opacity hover:opacity-75"
        >
          TESLA
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {siteConfig.navItems.map((link) => {
            return (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-black/5 hover:text-black"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <button
            type="button"
            aria-label="Help"
            className="rounded-full p-2 text-neutral-800 transition-colors hover:bg-black/5 hover:text-black"
          >
            <CircleHelp className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Language"
            className="rounded-full p-2 text-neutral-800 transition-colors hover:bg-black/5 hover:text-black"
          >
            <Globe className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="rounded-full p-2 text-neutral-800 transition-colors hover:bg-black/5 hover:text-black"
          >
            <UserCircle className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-full p-2 text-neutral-900 transition-colors hover:bg-black/5 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>
    </header>
  );
}
