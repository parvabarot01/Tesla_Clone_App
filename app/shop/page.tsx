import type { Metadata } from "next";

import { CtaGroup } from "@/components/shared/CtaGroup";
import { PageTransition } from "@/components/shared/PageTransition";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore charging, lifestyle, and vehicle accessories.",
};

const shopCategories = [
  {
    eyebrow: "01",
    title: "Charging Gear",
    description:
      "Placeholder accessories for daily charging setups, cable management, and compact travel essentials.",
  },
  {
    eyebrow: "02",
    title: "Interior + Comfort",
    description:
      "Simple add-ons framed around cabin protection, storage, and a cleaner everyday driving environment.",
  },
  {
    eyebrow: "03",
    title: "Travel Essentials",
    description:
      "Curated placeholder products for road trips, organization, and practical carry solutions on the go.",
  },
];

export default function ShopPage() {
  return (
    <PageTransition>
      <PageHero
        title="Shop Accessories"
        subtitle="Explore charging, lifestyle, and vehicle accessories."
        backgroundImage="/images/shop-page.jpg"
        primaryButtonText="Browse Shop"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <SectionHeader
              eyebrow="Shop"
              title="Curated categories for a cleaner experience"
              description="This placeholder shop layer keeps the frontend focused while giving the app a more complete top-level structure."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {shopCategories.map((item) => (
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
                eyebrow="Curated Experience"
                title="Present the shop as part of the wider ecosystem"
                description="Keep this final page lightweight, curated, and clearly connected to the charging and vehicle flows already present in the app."
              />
              <div className="mt-8">
                <CtaGroup
                  primaryLabel="Explore Charging"
                  primaryHref={ROUTES.charging}
                  secondaryLabel="Explore Vehicles"
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
