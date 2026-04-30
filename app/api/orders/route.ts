import {
  createApiErrorResponse,
  createApiSuccessResponse,
  isRecord,
  readString,
} from "@/lib/api";
import { createOrderPayload, validateOrderSelection } from "@/lib/order";
import type { OrderPayload, OrderSelection } from "@/types";

function getOrderSelectionFromPayload(body: Record<string, unknown>) {
  const selectionSource = isRecord(body.selection) ? body.selection : {};
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
  try {
    const body = (await request.json()) as unknown;

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

    const submittedAt = readString(body.submittedAt) || undefined;
    const payload = createOrderPayload(validation, submittedAt);
    const confirmation = {
      accepted: true as const,
      message: "Mock order payload accepted. No payment or real order was created.",
      order: payload satisfies OrderPayload,
    };

    return createApiSuccessResponse(confirmation);
  } catch {
    return createApiErrorResponse(
      "INVALID_ORDER_REQUEST",
      "Unable to process the order payload.",
      { status: 400 }
    );
  }
}
