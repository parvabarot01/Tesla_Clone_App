import type { Metadata } from "next";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { PageTransition } from "@/components/shared/PageTransition";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Discover",
  description: "Learn about safety, software, design, and connected driving.",
};

const discoverHighlights = [
  {
    eyebrow: "Safety",
    title: "Confidence through visibility",
    description:
      "Surface driver-assistance concepts, alerting, and visibility in a way that feels clear, calm, and easy to understand.",
  },
  {
    eyebrow: "Software",
    title: "Updates that keep the experience fresh",
    description:
      "Frame software as an evolving part of the vehicle experience, with interface improvements and ongoing feature refinement.",
  },
  {
    eyebrow: "Design",
    title: "Minimal, focused, and functional",
    description:
      "Present interior and exterior design as a balance of clean surfaces, practical controls, and a connected driving environment.",
  },
];

export default function DiscoverPage() {
  return (
    <PageTransition>
      <PageHero
        title="Discover the Future of Mobility"
        subtitle="Learn about safety, software, design, and connected driving."
        backgroundImage="/images/discover-page.jpg"
        primaryButtonText="Explore Features"
        secondaryButtonText="Learn More"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Discover"
              title="The story behind the product experience"
              description="This placeholder page adds just enough structure to present safety, software, and design as part of a cohesive portfolio flow."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {discoverHighlights.map((item) => (
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
                eyebrow="Explore More"
                title="Use discoverability to guide the next action"
                description="This simple CTA block keeps the page lightweight while connecting feature discovery back to the rest of the frontend experience."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Explore Vehicles"
                  primaryHref={ROUTES.vehicles}
                  secondaryLabel="View Energy"
                  secondaryHref={ROUTES.energy}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
