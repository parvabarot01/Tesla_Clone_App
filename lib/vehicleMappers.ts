import type { Vehicle as DbVehicle } from "@/generated/prisma/client";
import type { Vehicle } from "@/types";

const vehiclePriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function mapDbVehicleToVehicle(dbVehicle: DbVehicle): Vehicle {
  return {
    id: dbVehicle.id,
    slug: dbVehicle.slug,
    name: dbVehicle.name,
    category: dbVehicle.category,
    tagline: dbVehicle.tagline,
    image: dbVehicle.image,
    range: dbVehicle.range,
    topSpeed: dbVehicle.topSpeed,
    acceleration: dbVehicle.acceleration,
    startingPrice: vehiclePriceFormatter.format(dbVehicle.startingPrice),
  };
}
