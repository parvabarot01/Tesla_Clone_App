"use client";

import Link from "next/link";
import { Menu, X, CircleHelp, Globe, Shield, UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type NavbarClientProps = {
  accountHref: string;
  accountLabel: string;
  adminHref?: string;
  authenticated: boolean;
};

export function NavbarClient({
  accountHref,
  accountLabel,
  adminHref,
  authenticated,
}: NavbarClientProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nextValue = window.scrollY > 16;

      setHasScrolled((currentValue) =>
        currentValue === nextValue ? currentValue : nextValue
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          hasScrolled || isMobileMenuOpen
            ? "border-b border-black/8 bg-white/88 shadow-[0_12px_32px_rgba(17,17,17,0.08)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/56 backdrop-blur-md"
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            href={ROUTES.home}
            className="text-sm font-semibold tracking-[0.35em] text-neutral-950 transition-[opacity,transform] duration-200 hover:opacity-75 motion-safe:hover:-translate-y-px"
          >
            TESLA
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {siteConfig.navItems.map((link) => {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="inline-flex items-center justify-center rounded-full p-2 text-neutral-900 transition-[background-color,color,transform] duration-200 hover:bg-black/5 md:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={isMobileMenuOpen ? "close" : "open"}
                initial={{
                  opacity: 0,
                  rotate: isMobileMenuOpen ? -45 : 45,
                  scale: 0.92,
                }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  rotate: isMobileMenuOpen ? 45 : -45,
                  scale: 0.92,
                }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              aria-label="Help"
              className="rounded-full p-2 text-neutral-800 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
            >
              <CircleHelp className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Language"
              className="rounded-full p-2 text-neutral-800 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
            >
              <Globe className="h-5 w-5" />
            </button>
            <Link
              href={accountHref}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 transition-[background-color,border-color,color,transform] duration-200 hover:border-black/12 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
            >
              <UserCircle className="h-4 w-4" />
              <span>{accountLabel}</span>
            </Link>
            {adminHref ? (
              <Link
                href={adminHref}
                className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 transition-[background-color,border-color,color,transform] duration-200 hover:border-black/12 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            ) : null}
            {authenticated ? (
              <SignOutButton
                callbackUrl={ROUTES.home}
                size="lg"
                variant="ghost"
                className="h-11 rounded-full px-4 text-sm font-medium text-neutral-700 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
              >
                Sign Out
              </SignOutButton>
            ) : null}
          </div>
        </nav>
      </header>
      <MobileMenu
        accountHref={accountHref}
        accountLabel={accountLabel}
        adminHref={adminHref}
        authenticated={authenticated}
        isOpen={isMobileMenuOpen}
        navItems={siteConfig.navItems}
        onClose={() => setIsMobileMenuOpen(false)}
        panelId="mobile-navigation"
      />
    </>
  );
}
