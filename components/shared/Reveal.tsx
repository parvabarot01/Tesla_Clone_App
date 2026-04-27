"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { fadeIn, fadeInUp, sectionViewport, withDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealElement = "div" | "section" | "article";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: RevealElement;
};

const revealElements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = revealElements[as];
  const variants = withDelay(
    prefersReducedMotion ? fadeIn : fadeInUp,
    prefersReducedMotion ? 0 : delay
  );

  return (
    <Component
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...sectionViewport, once }}
    >
      {children}
    </Component>
  );
}
