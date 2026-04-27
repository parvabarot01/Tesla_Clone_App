import type { Metadata } from "next";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { PageTransition } from "@/components/shared/PageTransition";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Charging",
  description: "Charge at home or on the road with a growing charging network.",
};

const chargingHighlights = [
  {
    eyebrow: "Home",
    title: "Everyday charging at home",
    description:
      "Start each morning with a charged battery using a simple overnight routine designed for daily convenience.",
  },
  {
    eyebrow: "Road",
    title: "Confident charging on the move",
    description:
      "Plan longer trips around a clean, fast-charging experience that keeps travel stops short and predictable.",
  },
];

export default function ChargingPage() {
  return (
    <PageTransition>
      <PageHero
        title="Charging Made Simple"
        subtitle="Charge at home or on the road with a growing charging network."
        backgroundImage="/images/charging-page.jpg"
        primaryButtonText="Find Chargers"
        secondaryButtonText="Learn More"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Charging Flow"
              title="Designed for both routine and range"
              description="This placeholder charging page rounds out the product story with a simple split between home charging and on-road support."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 lg:grid-cols-2"
            delayChildren={0.03}
            staggerChildren={0.08}
          >
            {chargingHighlights.map((item) => (
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
                eyebrow="Plan Ahead"
                title="Connect charging to the rest of the ownership flow"
                description="Keep this section lightweight and frontend-only while still presenting charging as a thoughtful part of the overall experience."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Explore Vehicles"
                  primaryHref={ROUTES.vehicles}
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
