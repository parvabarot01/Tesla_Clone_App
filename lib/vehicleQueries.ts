import "server-only";

import { getPrismaClient } from "@/lib/prisma";
import { mapDbVehicleToVehicle } from "@/lib/vehicleMappers";
import type { Vehicle } from "@/types";

const vehicleOrderBy = [
  { createdAt: "asc" as const },
  { name: "asc" as const },
];

export async function getVehiclesFromDatabase(): Promise<Vehicle[]> {
  const prisma = getPrismaClient();
  const dbVehicles = await prisma.vehicle.findMany({
    orderBy: vehicleOrderBy,
  });

  return dbVehicles.map(mapDbVehicleToVehicle);
}

export async function getVehicleBySlugFromDatabase(
  slug: string
): Promise<Vehicle | undefined> {
  if (!slug) {
    return undefined;
  }

  const prisma = getPrismaClient();
  const dbVehicle = await prisma.vehicle.findUnique({
    where: { slug },
  });

  return dbVehicle ? mapDbVehicleToVehicle(dbVehicle) : undefined;
}

export async function getVehicleSlugsFromDatabase(): Promise<string[]> {
  const prisma = getPrismaClient();
  const vehicles = await prisma.vehicle.findMany({
    orderBy: vehicleOrderBy,
    select: {
      slug: true,
    },
  });

  return vehicles.map((vehicle) => vehicle.slug);
}
