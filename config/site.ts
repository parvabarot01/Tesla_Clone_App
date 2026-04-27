import { ROUTES } from "@/constants/routes";
import type { NavItem } from "@/types";

export const siteConfig = {
  name: "Tesla Clone",
  description: "A scalable Tesla-inspired frontend built with Next.js.",
  url: "http://localhost:3000",
  creator: "Your Name",
  navItems: [
    { label: "Vehicles", href: ROUTES.vehicles },
    { label: "Energy", href: ROUTES.energy },
    { label: "Charging", href: ROUTES.charging },
    { label: "Discover", href: ROUTES.discover },
    { label: "Shop", href: ROUTES.shop },
  ] satisfies NavItem[],
};
