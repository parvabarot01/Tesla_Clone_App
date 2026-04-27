"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  createStaggerContainer,
  fadeIn,
  fadeInUp,
  sectionViewport,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerGroupElement = "div" | "section";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  as?: StaggerGroupElement;
  delayChildren?: number;
  staggerChildren?: number;
};

const staggerElements = {
  div: motion.div,
  section: motion.section,
} as const;

export function StaggerGroup({
  children,
  className,
  as = "div",
  delayChildren,
  staggerChildren,
}: StaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = staggerElements[as];
  const itemVariants = prefersReducedMotion ? fadeIn : fadeInUp;
  const containerVariants = createStaggerContainer(
    prefersReducedMotion
      ? { delayChildren: 0, staggerChildren: 0 }
      : { delayChildren, staggerChildren }
  );

  return (
    <Component
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      {Children.map(children, (child, index) => (
        <motion.div
          key={isValidElement(child) && child.key != null ? child.key : index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </Component>
  );
}
