import type { Metadata } from "next";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { PageTransition } from "@/components/shared/PageTransition";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Energy",
  description: "Generate, store, and manage clean energy from your home.",
};

const energyHighlights = [
  {
    eyebrow: "01",
    title: "Generate at Home",
    description:
      "Use rooftop solar as a clean source of energy for everyday routines, from morning starts to overnight charging habits.",
  },
  {
    eyebrow: "02",
    title: "Store for Later",
    description:
      "Pair generation with backup storage so your home can stay more resilient during outages and peak-demand hours.",
  },
];

export default function EnergyPage() {
  return (
    <PageTransition>
      <PageHero
        title="Energy for Everything"
        subtitle="Generate, store, and manage clean energy from your home."
        backgroundImage="/images/energy-page.jpg"
        primaryButtonText="Order Now"
        secondaryButtonText="Learn More"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Home Energy"
              title="A cleaner setup for daily life"
              description="This frontend-only concept page presents solar generation and storage as a connected home energy experience."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 lg:grid-cols-2"
            delayChildren={0.03}
            staggerChildren={0.08}
          >
            {energyHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-black/6 bg-neutral-50 p-6 shadow-[0_16px_40px_rgba(17,17,17,0.06)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-px motion-safe:hover:shadow-[0_20px_44px_rgba(17,17,17,0.08)] sm:p-8"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  {item.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-neutral-50 pb-20 pt-4 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] border border-black/6 bg-white px-6 py-8 text-center shadow-[0_18px_48px_rgba(17,17,17,0.06)] sm:px-8 sm:py-10">
              <SectionHeader
                eyebrow="Next Step"
                title="Build a smarter energy routine"
                description="Use this page as a polished placeholder for a future energy sales flow, while keeping the current app frontend-only."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Explore Charging"
                  primaryHref={ROUTES.charging}
                  secondaryLabel="Browse Shop"
                  secondaryHref={ROUTES.shop}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
