import type { Metadata } from "next";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { InfoCard } from "@/components/shared/InfoCard";
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

const discoverPerspective = [
  {
    eyebrow: "Driver Focus",
    title: "A calmer ownership story",
    description:
      "Use editorial-style product copy to connect daily driving, usability, and confidence into one coherent experience.",
  },
  {
    eyebrow: "Connected",
    title: "Software that stays present but quiet",
    description:
      "Describe updates and connected features as subtle improvements to the experience, not as noise around it.",
  },
  {
    eyebrow: "Minimal Form",
    title: "Design that supports function",
    description:
      "Frame materials, space, and interface choices as practical and focused rather than decorative.",
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
              description="Tell a clearer product story around safety, software, and design so the page feels more editorial, intentional, and complete."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {discoverHighlights.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
              >
                <p className="text-sm font-semibold text-neutral-950">
                  Structured to feel like a polished overview rather than a placeholder block.
                </p>
              </InfoCard>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.06)] sm:p-8">
              <SectionHeader
                eyebrow="Perspective"
                title="A broader product philosophy"
                description="Use the supporting content below to connect interface clarity, safety confidence, and quiet performance into one wider mobility narrative."
                align="left"
              />
              <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600 sm:text-base">
                <p>
                  The goal of this page is not to simulate every feature, but to
                  show how the surrounding product story can feel deeper and
                  more complete before backend systems exist.
                </p>
                <p>
                  That makes the route more useful in a portfolio context while
                  still keeping the implementation lightweight and frontend-only.
                </p>
              </div>
            </div>
          </Reveal>

          <StaggerGroup
            className="grid gap-6"
            delayChildren={0.03}
            staggerChildren={0.08}
          >
            {discoverPerspective.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
                className="bg-white"
              />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-white pb-20 pt-4 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] border border-black/6 bg-neutral-50 px-6 py-8 text-center shadow-[0_18px_48px_rgba(17,17,17,0.06)] sm:px-8 sm:py-10">
              <SectionHeader
                eyebrow="Explore More"
                title="Guide the next step with more context"
                description="Use this editorial placeholder layer to connect discovery back to model comparison, vehicle exploration, and the rest of the frontend experience."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Compare Vehicles"
                  primaryHref={ROUTES.compare}
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
