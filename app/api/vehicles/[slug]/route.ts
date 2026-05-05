import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/lib/api";
import { getVehicleBySlugFromDatabase } from "@/lib/vehicleQueries";

type VehicleRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: VehicleRouteContext
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return createApiErrorResponse(
        "VEHICLE_SLUG_REQUIRED",
        "A vehicle slug is required to load vehicle details.",
        { status: 400 }
      );
    }

    const vehicle = await getVehicleBySlugFromDatabase(slug);

    if (!vehicle) {
      return createApiErrorResponse(
        "VEHICLE_NOT_FOUND",
        "No vehicle was found for the provided slug.",
        { status: 404 }
      );
    }

    return createApiSuccessResponse(vehicle);
  } catch {
    return createApiErrorResponse(
      "VEHICLE_FETCH_FAILED",
      "Unable to load vehicle details right now.",
      { status: 500 }
    );
  }
}
