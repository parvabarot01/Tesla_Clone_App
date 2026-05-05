import {
  createApiErrorResponse,
  createApiSuccessResponse,
  isRecord,
  readRecord,
  readString,
} from "@/lib/api";
import {
  mapPersistedOrderToConfirmation,
  mapValidatedOrderToCreateInput,
} from "@/lib/orderMappers";
import { getPrismaClient } from "@/lib/prisma";
import { validateOrderSelection } from "@/lib/order";
import type { OrderSelection } from "@/types";

function getOrderSelectionFromPayload(body: Record<string, unknown>) {
  const selectionSource = readRecord(body.selection);
  const topLevelVehicleSlug = readString(body.vehicleSlug);
  const nestedVehicleSlug = readString(selectionSource.vehicleSlug);

  return {
    vehicleSlug: nestedVehicleSlug || topLevelVehicleSlug,
    paintId: readString(selectionSource.paintId),
    wheelId: readString(selectionSource.wheelId),
    interiorId: readString(selectionSource.interiorId),
  } satisfies OrderSelection;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return createApiErrorResponse(
      "INVALID_ORDER_REQUEST",
      "Unable to process the order payload.",
      { status: 400 }
    );
  }

  if (!isRecord(body)) {
    return createApiErrorResponse(
      "INVALID_ORDER_PAYLOAD",
      "A valid order payload is required.",
      { status: 400 }
    );
  }

  const selection = getOrderSelectionFromPayload(body);
  const validation = validateOrderSelection(selection);

  if (!validation.isValid) {
    return createApiErrorResponse(
      "INVALID_ORDER_SELECTION",
      "Review the selected configuration and try again.",
      {
        details: validation.errors,
        status: 400,
      }
    );
  }

  const submittedAt = readString(body.submittedAt) || new Date().toISOString();

  try {
    const prisma = getPrismaClient();
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        slug: validation.selection.vehicleSlug,
      },
    });

    if (!vehicle) {
      return createApiErrorResponse(
        "ORDER_VEHICLE_NOT_FOUND",
        "The selected vehicle is no longer available.",
        { status: 404 }
      );
    }

    const persistedOrder = await prisma.order.create({
      data: mapValidatedOrderToCreateInput(validation, vehicle, submittedAt),
    });

    return createApiSuccessResponse(
      mapPersistedOrderToConfirmation(persistedOrder),
      { status: 201 }
    );
  } catch {
    return createApiErrorResponse(
      "ORDER_PERSIST_FAILED",
      "Unable to save the order right now.",
      { status: 500 }
    );
  }
}
