"use client";

import Link from "next/link";
import { CircleHelp, Globe, UserCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SignOutButton } from "@/components/auth/SignOutButton";
import type { NavItem } from "@/types";
import { ROUTES } from "@/constants/routes";
import {
  createStaggerContainer,
  fadeIn,
  fadeInUp,
  mobileMenuBackdrop,
  mobileMenuList,
  mobileMenuPanel,
} from "@/lib/motion";

type MobileMenuProps = {
  accountHref: string;
  accountLabel: string;
  authenticated: boolean;
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
  panelId: string;
};

export function MobileMenu({
  accountHref,
  accountLabel,
  authenticated,
  isOpen,
  navItems,
  onClose,
  panelId,
}: MobileMenuProps) {
  const prefersReducedMotion = useReducedMotion();
  const menuItems: NavItem[] = [{ label: "Home", href: ROUTES.home }, ...navItems];
  const itemVariants = prefersReducedMotion ? fadeIn : fadeInUp;
  const listVariants = prefersReducedMotion
    ? createStaggerContainer({ delayChildren: 0, staggerChildren: 0 })
    : mobileMenuList;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            key="mobile-menu-backdrop"
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-[60] bg-black/28 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
            variants={mobileMenuBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.aside
            key="mobile-menu-panel"
            id={panelId}
            aria-label="Mobile navigation panel"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-xs flex-col border-l border-black/8 bg-white/96 shadow-[0_20px_54px_rgba(17,17,17,0.16)] backdrop-blur-xl md:hidden"
            variants={mobileMenuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
              <Link
                href={ROUTES.home}
                onClick={onClose}
                className="text-sm font-semibold tracking-[0.35em] text-neutral-950 transition-opacity hover:opacity-75"
              >
                TESLA
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full p-2 text-neutral-900 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:-translate-y-px"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.nav
              aria-label="Mobile primary"
              className="flex-1 overflow-y-auto px-4 py-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <motion.li key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-base font-medium text-neutral-900 transition-[background-color,color,transform] duration-200 hover:bg-black/5 hover:text-black motion-safe:hover:translate-x-0.5"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <div className="border-t border-black/6 px-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  aria-label="Help"
                  className="flex flex-col items-center gap-2 rounded-[1.15rem] border border-black/6 bg-white px-3 py-3 text-xs font-medium text-neutral-700 transition-[background-color,border-color,color,transform] duration-200 hover:border-black/10 hover:bg-neutral-50 hover:text-neutral-950 motion-safe:hover:-translate-y-px"
                >
                  <CircleHelp className="h-4 w-4" />
                  <span>Help</span>
                </button>
                <button
                  type="button"
                  aria-label="Language"
                  className="flex flex-col items-center gap-2 rounded-[1.15rem] border border-black/6 bg-white px-3 py-3 text-xs font-medium text-neutral-700 transition-[background-color,border-color,color,transform] duration-200 hover:border-black/10 hover:bg-neutral-50 hover:text-neutral-950 motion-safe:hover:-translate-y-px"
                >
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                </button>
                <Link
                  href={accountHref}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 rounded-[1.15rem] border border-black/6 bg-white px-3 py-3 text-xs font-medium text-neutral-700 transition-[background-color,border-color,color,transform] duration-200 hover:border-black/10 hover:bg-neutral-50 hover:text-neutral-950 motion-safe:hover:-translate-y-px"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>{accountLabel}</span>
                </Link>
              </div>
              {authenticated ? (
                <div className="mt-3">
                  <SignOutButton
                    callbackUrl={ROUTES.home}
                    size="lg"
                    variant="outline"
                    className="h-11 w-full rounded-full border-black/8 px-4 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-200 hover:bg-neutral-50 motion-safe:hover:-translate-y-px"
                  >
                    Sign Out
                  </SignOutButton>
                </div>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
