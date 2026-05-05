import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/lib/api";
import { getVehiclesFromDatabase } from "@/lib/vehicleQueries";

export async function GET() {
  try {
    const vehicles = await getVehiclesFromDatabase();

    return createApiSuccessResponse(vehicles);
  } catch {
    return createApiErrorResponse(
      "VEHICLE_FETCH_FAILED",
      "Unable to load vehicles right now.",
      { status: 500 }
    );
  }
}
