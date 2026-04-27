import type { Vehicle } from "@/types";

export const vehicles: Vehicle[] = [
  {
    id: "model-3",
    slug: "model-3",
    name: "Model 3",
    category: "Sedan",
    tagline: "Smart, efficient, and built for everyday electric driving.",
    image: "/images/order/model-3/stealth-grey.jpeg",
    range: "363 mi",
    topSpeed: "125 mph",
    acceleration: "2.9 sec",
    startingPrice: "$38,990",
  },
  {
    id: "model-y",
    slug: "model-y",
    name: "Model Y",
    category: "SUV",
    tagline: "Versatile electric SUV designed for families and daily use.",
    image: "/images/order/model-y/stealth-grey.jpeg",
    range: "320 mi",
    topSpeed: "135 mph",
    acceleration: "3.5 sec",
    startingPrice: "$44,990",
  },
  {
    id: "cybertruck",
    slug: "cybertruck",
    name: "Cybertruck",
    category: "Truck",
    tagline: "Durable utility with bold design and electric power.",
    image: "/images/order/cybertruck/grey.avif",
    range: "340 mi",
    topSpeed: "130 mph",
    acceleration: "2.6 sec",
    startingPrice: "$60,990",
  },
];

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}
