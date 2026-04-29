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
  title: "Charging",
  description: "Charge at home or on the road with a growing charging network.",
};

const chargingModes = [
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

const chargingBenefits = [
  {
    eyebrow: "01",
    title: "Overnight-ready routine",
    description:
      "Keep charging predictable with a setup built around your normal parking and daily schedule.",
  },
  {
    eyebrow: "02",
    title: "Route confidence",
    description:
      "Frame longer trips as a clear sequence of short stops rather than a separate planning challenge.",
  },
  {
    eyebrow: "03",
    title: "Simple plug-in experience",
    description:
      "Keep the ownership story focused on ease, consistency, and a charger experience that fades into the background.",
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
              description="Shape the charging story around two familiar moments: waking up ready to drive and staying confident on longer routes."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 lg:grid-cols-2"
            delayChildren={0.03}
            staggerChildren={0.08}
          >
            {chargingModes.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
              >
                <p className="text-sm font-semibold text-neutral-950">
                  Built to feel as straightforward as the rest of the product experience.
                </p>
              </InfoCard>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Benefits"
              title="A cleaner charging rhythm"
              description="Use lightweight placeholder content to show how charging can feel integrated into ownership rather than treated as a separate task."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {chargingBenefits.map((item) => (
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
                eyebrow="Plan Ahead"
                title="Connect charging to the rest of the ownership flow"
                description="Keep the page premium and product-like by linking charging back to model exploration, ownership planning, and the broader frontend story."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Find Chargers"
                  primaryHref={ROUTES.discover}
                  secondaryLabel="Learn More"
                  secondaryHref={ROUTES.vehicles}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
