"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { fadeIn, slideInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={prefersReducedMotion ? fadeIn : slideInUp}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
