"use client";

import { motion } from "framer-motion";

import { ActionButton } from "@/components/shared/ActionButton";
import { siteConfig } from "@/config/site";
import { resolveBackgroundImage } from "@/lib/utils";
import type { HeroContent } from "@/types";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-neutral-900"
        style={{
          backgroundImage: resolveBackgroundImage(
            content.backgroundImage,
            "linear-gradient(180deg, rgba(17, 17, 17, 0.2) 0%, rgba(17, 17, 17, 0.52) 42%, rgba(17, 17, 17, 0.82) 100%)"
          ),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 flex min-h-[calc(100svh-6rem)] items-start justify-center md:min-h-[calc(100svh-3.5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex w-full max-w-5xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-24 md:pt-28"
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
              {content.eyebrow ?? siteConfig.name}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="text-base font-medium text-white/85 sm:text-lg">
              {content.subtitle}
            </p>
            {content.description ? (
              <p className="mx-auto max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {content.description}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ActionButton
              action={content.primaryCta}
              size="lg"
              className="h-11 min-w-[220px] rounded-full bg-white px-8 text-sm font-semibold text-neutral-950 hover:bg-white/90"
            />
            <ActionButton
              action={content.secondaryCta}
              size="lg"
              variant="outline"
              className="h-11 min-w-[220px] rounded-full border-white/25 bg-black/25 px-8 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/35 hover:text-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
