import type { Metadata } from "next";

import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Discover",
  description: "Learn about safety, software, design, and connected driving.",
};

export default function DiscoverPage() {
  return (
    <PageHero
      title="Discover the Future of Mobility"
      subtitle="Learn about safety, software, design, and connected driving."
      backgroundImage="/images/discover-page.jpg"
      primaryButtonText="Explore Features"
      secondaryButtonText="Learn More"
    />
  );
}
