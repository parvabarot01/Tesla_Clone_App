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
  title: "Energy",
  description: "Generate, store, and manage clean energy from your home.",
};

const energyEcosystem = [
  {
    eyebrow: "01",
    title: "Solar Panels",
    description:
      "Capture sunlight across the day and turn your roof into a cleaner source of power for everyday routines.",
  },
  {
    eyebrow: "02",
    title: "Powerwall",
    description:
      "Store excess energy for evening use, peak-demand hours, and a steadier backup plan during outages.",
  },
  {
    eyebrow: "03",
    title: "Energy Independence",
    description:
      "Bring generation, storage, and charging together into one system designed to feel simple and self-directed.",
  },
];

const energyBenefits = [
  {
    title: "Clean energy flow",
    description:
      "Move from generation to storage and vehicle charging with a setup that feels calm, connected, and easy to monitor.",
    points: ["Generate through the day", "Use stored energy at night"],
  },
  {
    title: "Outage readiness",
    description:
      "Keep essential loads covered with a smarter backup layer built into the wider home energy ecosystem.",
    points: ["Backup for priority rooms", "More resilient daily planning"],
  },
  {
    title: "Energy management",
    description:
      "See production, storage, and usage in one place so the system feels understandable rather than technical.",
    points: ["Track usage with clarity", "Coordinate charging and storage"],
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
              eyebrow="Home Energy Ecosystem"
              title="A cleaner setup for daily life"
              description="Present solar generation, battery storage, and home charging as one connected energy story that feels calm, modern, and product-led."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {energyEcosystem.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
              >
                <p className="text-sm font-semibold text-neutral-950">
                  Built to work alongside a more independent daily routine.
                </p>
              </InfoCard>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <Reveal className="max-w-2xl">
            <SectionHeader
              eyebrow="Benefits"
              title="Built around everyday control"
              description="Keep the page frontend-only while still telling a stronger story about how generation, storage, and home energy management work together."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="grid gap-6"
            delayChildren={0.03}
            staggerChildren={0.08}
          >
            {energyBenefits.map((item) => (
              <InfoCard
                key={item.title}
                title={item.title}
                description={item.description}
                className="bg-white"
              >
                <ul className="space-y-2 text-sm leading-6 text-neutral-600">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </InfoCard>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-white pb-20 pt-4 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] border border-black/6 bg-neutral-50 px-6 py-8 text-center shadow-[0_18px_48px_rgba(17,17,17,0.06)] sm:px-8 sm:py-10">
              <SectionHeader
                eyebrow="Next Step"
                title="Build a smarter home energy story"
                description="Use this richer placeholder page to show how energy fits into the broader ownership experience while the app stays fully frontend-only."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Explore Charging"
                  primaryHref={ROUTES.charging}
                  secondaryLabel="Compare Vehicles"
                  secondaryHref={ROUTES.compare}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
