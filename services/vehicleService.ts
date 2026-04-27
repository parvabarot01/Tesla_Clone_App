import { vehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types";

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    return [...vehicles];
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    return vehicles.find((vehicle) => vehicle.slug === slug);
  },

  async getVehicleSlugs(): Promise<string[]> {
    return vehicles.map((vehicle) => vehicle.slug);
  },

  async getFeaturedVehicles(limit?: number): Promise<Vehicle[]> {
    const featuredVehicles = [...vehicles];

    return typeof limit === "number"
      ? featuredVehicles.slice(0, limit)
      : featuredVehicles;
  },
};
