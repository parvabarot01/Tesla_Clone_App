import type { Metadata } from "next";

import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore charging, lifestyle, and vehicle accessories.",
};

export default function ShopPage() {
  return (
    <PageHero
      title="Shop Accessories"
      subtitle="Explore charging, lifestyle, and vehicle accessories."
      backgroundImage="/images/shop-page.jpg"
      primaryButtonText="Browse Shop"
    />
  );
}
