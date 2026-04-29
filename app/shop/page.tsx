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
  {
    eyebrow: "04",
    title: "Lifestyle",
    description:
      "Lightweight brand-adjacent placeholders that help the ecosystem feel broader without turning the page into full ecommerce.",
  },
];

const featuredShopItems = [
  {
    eyebrow: "Featured",
    title: "Wall Connector Kit",
    description:
      "A premium placeholder item positioned around home charging convenience and a cleaner install story.",
    detail: "Charging",
    meta: "Placeholder item",
  },
  {
    eyebrow: "Featured",
    title: "All-Weather Interior Mats",
    description:
      "A practical placeholder product focused on protection, cleanup, and a more durable everyday cabin setup.",
    detail: "Interior",
    meta: "Placeholder item",
  },
  {
    eyebrow: "Featured",
    title: "Travel Organizer Set",
    description:
      "A simple road-trip-focused placeholder item that suggests storage, carry solutions, and cleaner packing.",
    detail: "Travel",
    meta: "Placeholder item",
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
              description="Expand the shop into a more believable supporting route with category structure, featured placeholders, and a clearer ecosystem role."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {shopCategories.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
              >
                <p className="text-sm font-semibold text-neutral-950">
                  Placeholder category designed to support the wider ownership story.
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
              eyebrow="Featured Items"
              title="Placeholder products with clearer merchandising"
              description="Use a small featured grid to suggest how curated accessories could sit alongside charging, interiors, and travel use cases."
              align="left"
            />
          </Reveal>

          <StaggerGroup
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            delayChildren={0.03}
            staggerChildren={0.07}
          >
            {featuredShopItems.map((item) => (
              <InfoCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
                className="bg-white"
              >
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-neutral-950">
                    {item.detail}
                  </span>
                  <span className="text-neutral-500">{item.meta}</span>
                </div>
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
                eyebrow="Curated Experience"
                title="Present the shop as part of the wider ecosystem"
                description="Keep the route frontend-only while still showing how charging accessories, travel gear, and cabin products can round out the ownership experience."
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
