import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/lib/api";
import { vehicleService } from "@/services/vehicleService";

export async function GET() {
  try {
    const vehicles = await vehicleService.getVehicles({ source: "local" });

    return createApiSuccessResponse(vehicles);
  } catch {
    return createApiErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "Unable to load vehicles right now.",
      { status: 500 }
    );
  }
}
