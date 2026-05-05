import "dotenv/config";

import { vehicles } from "../data/vehicles";
import { getPrismaClient } from "../lib/prisma";

function parseStartingPrice(startingPrice: string): number {
  const parsedStartingPrice = Number.parseInt(
    startingPrice.replace(/[^0-9]/g, ""),
    10
  );

  if (Number.isNaN(parsedStartingPrice)) {
    throw new Error(`Unable to parse starting price: ${startingPrice}`);
  }

  return parsedStartingPrice;
}

async function seedVehicles() {
  const prisma = getPrismaClient();

  for (const vehicle of vehicles) {
    const vehicleRecord = {
      slug: vehicle.slug,
      name: vehicle.name,
      category: vehicle.category,
      tagline: vehicle.tagline,
      image: vehicle.image,
      range: vehicle.range,
      topSpeed: vehicle.topSpeed,
      acceleration: vehicle.acceleration,
      startingPrice: parseStartingPrice(vehicle.startingPrice),
    };

    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: vehicleRecord,
      create: vehicleRecord,
    });
  }
}

async function main() {
  await seedVehicles();

  console.log(`Seeded ${vehicles.length} vehicles.`);
}

main()
  .catch((error: unknown) => {
    console.error("Vehicle seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await getPrismaClient().$disconnect();
    } catch {}
  });
