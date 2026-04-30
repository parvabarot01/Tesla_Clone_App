import { API_ROUTES } from "@/constants/api";
import { getVehicleBySlug as getLocalVehicleBySlug, vehicles } from "@/data/vehicles";
import { ApiRequestError, fetchApiJson } from "@/lib/fetcher";
import type { Vehicle } from "@/types";

const DEVELOPMENT_API_BASE_URL = "http://localhost:3000";

export type VehicleServiceSource = "auto" | "api" | "local";

type VehicleServiceOptions = {
  source?: VehicleServiceSource;
};

// `auto` prefers the mock API contract and falls back to local data.
// `local` keeps route handlers and static generation independent from fetches.
async function getLocalVehicles(): Promise<Vehicle[]> {
  return [...vehicles];
}

async function findLocalVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  return getLocalVehicleBySlug(slug);
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

function shouldTryApiSource(source: VehicleServiceSource): boolean {
  return source === "api" || source === "auto";
}

export const vehicleService = {
  async getVehicles(options: VehicleServiceOptions = {}): Promise<Vehicle[]> {
    const source = options.source ?? "auto";

    if (shouldUseLocalSource(source)) {
      return getLocalVehicles();
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

    if (shouldTryApiSource(source)) {
      try {
        return await fetchVehicleBySlugFromApi(slug);
      } catch (error) {
        if (source === "api") {
          throw error;
        }
      }
    }

    return findLocalVehicleBySlug(slug);
  },

  async getVehicleSlugs(
    options: VehicleServiceOptions = {}
  ): Promise<string[]> {
    const source = options.source ?? "local";
    const sourceVehicles =
      source === "local"
        ? await getLocalVehicles()
        : await this.getVehicles({ source });

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
