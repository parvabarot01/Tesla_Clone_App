import "server-only";

import { API_ROUTES } from "@/constants/api";
import {
  getVehicleBySlug as getLocalVehicleBySlug,
  vehicles,
} from "@/data/vehicles";
import { ApiRequestError, fetchApiJson } from "@/lib/fetcher";
import {
  getVehicleBySlugFromDatabase,
  getVehicleSlugsFromDatabase,
  getVehiclesFromDatabase,
} from "@/lib/vehicleQueries";
import type { Vehicle } from "@/types";

const DEVELOPMENT_API_BASE_URL = "http://localhost:3000";

export type VehicleServiceSource = "auto" | "api" | "database" | "local";

type VehicleServiceOptions = {
  source?: VehicleServiceSource;
};

// `auto` prefers the API-backed vehicle routes, then direct DB reads,
// then the seeded local catalog as a final build/dev fallback.
// `local` stays available only for seed/setup-adjacent safety.
async function getLocalVehicles(): Promise<Vehicle[]> {
  return [...vehicles];
}

async function findLocalVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  return getLocalVehicleBySlug(slug);
}

async function getDatabaseVehicles(): Promise<Vehicle[]> {
  return getVehiclesFromDatabase();
}

async function findDatabaseVehicleBySlug(
  slug: string
): Promise<Vehicle | undefined> {
  return getVehicleBySlugFromDatabase(slug);
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getVehicleApiBaseUrl(): string | null {
  const configuredBaseUrl =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL;

  if (configuredBaseUrl) {
    const baseUrl = configuredBaseUrl.startsWith("http")
      ? configuredBaseUrl
      : `https://${configuredBaseUrl}`;

    return normalizeBaseUrl(baseUrl);
  }

  if (process.env.NODE_ENV === "development") {
    return DEVELOPMENT_API_BASE_URL;
  }

  return null;
}

async function fetchVehiclesFromApi(): Promise<Vehicle[]> {
  const baseUrl = getVehicleApiBaseUrl();

  if (!baseUrl) {
    throw new ApiRequestError({
      code: "VEHICLE_API_UNAVAILABLE",
      message: "Vehicle API base URL is not configured.",
      status: 503,
    });
  }

  return fetchApiJson<Vehicle[]>(`${baseUrl}${API_ROUTES.vehicles}`, {
    next: { revalidate: 60 },
  });
}

async function fetchVehicleBySlugFromApi(
  slug: string
): Promise<Vehicle | undefined> {
  const baseUrl = getVehicleApiBaseUrl();

  if (!baseUrl) {
    throw new ApiRequestError({
      code: "VEHICLE_API_UNAVAILABLE",
      message: "Vehicle API base URL is not configured.",
      status: 503,
    });
  }

  try {
    return await fetchApiJson<Vehicle>(`${baseUrl}${API_ROUTES.vehicleBySlug(slug)}`, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      error.code === "VEHICLE_NOT_FOUND"
    ) {
      return undefined;
    }

    throw error;
  }
}

function shouldUseLocalSource(source: VehicleServiceSource): boolean {
  return source === "local";
}

function shouldUseDatabaseSource(source: VehicleServiceSource): boolean {
  return source === "database";
}

function shouldTryApiSource(source: VehicleServiceSource): boolean {
  return source === "api" || source === "auto";
}

export const vehicleService = {
  async getVehicles(options: VehicleServiceOptions = {}): Promise<Vehicle[]> {
    const source = options.source ?? "auto";

    if (shouldUseLocalSource(source)) {
      return getLocalVehicles();
    }

    if (shouldUseDatabaseSource(source)) {
      return getDatabaseVehicles();
    }

    if (shouldTryApiSource(source)) {
      try {
        return await fetchVehiclesFromApi();
      } catch (error) {
        if (source === "api") {
          throw error;
        }
      }
    }

    try {
      return await getDatabaseVehicles();
    } catch (error) {
      if (source === "database") {
        throw error;
      }
    }

    return getLocalVehicles();
  },

  async getVehicleBySlug(
    slug: string,
    options: VehicleServiceOptions = {}
  ): Promise<Vehicle | undefined> {
    if (!slug) {
      return undefined;
    }

    const source = options.source ?? "auto";

    if (shouldUseLocalSource(source)) {
      return findLocalVehicleBySlug(slug);
    }

    if (shouldUseDatabaseSource(source)) {
      return findDatabaseVehicleBySlug(slug);
    }

    if (shouldTryApiSource(source)) {
      try {
        return await fetchVehicleBySlugFromApi(slug);
      } catch (error) {
        if (source === "api") {
          throw error;
        }
      }
    }

    try {
      return await findDatabaseVehicleBySlug(slug);
    } catch (error) {
      if (source === "database") {
        throw error;
      }
    }

    return findLocalVehicleBySlug(slug);
  },

  async getVehicleSlugs(
    options: VehicleServiceOptions = {}
  ): Promise<string[]> {
    const source = options.source ?? "auto";

    if (source === "local") {
      const sourceVehicles = await getLocalVehicles();

      return sourceVehicles.map((vehicle) => vehicle.slug);
    }

    if (source === "database") {
      return getVehicleSlugsFromDatabase();
    }

    const sourceVehicles = await this.getVehicles({ source });

    return sourceVehicles.map((vehicle) => vehicle.slug);
  },

  async getFeaturedVehicles(
    limit?: number,
    options: VehicleServiceOptions = {}
  ): Promise<Vehicle[]> {
    const featuredVehicles = await this.getVehicles(options);

    return typeof limit === "number"
      ? featuredVehicles.slice(0, limit)
      : featuredVehicles;
  },
};
