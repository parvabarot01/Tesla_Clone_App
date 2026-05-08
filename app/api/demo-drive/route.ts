import {
  createApiErrorResponse,
  createApiSuccessResponse,
  isRecord,
  readRecord,
  readString,
} from "@/lib/api";
import {
  createDemoDriveReferenceId,
  validateDemoDriveForm,
} from "@/lib/demoDrive";
import {
  mapPersistedDemoDriveToConfirmation,
  mapValidatedDemoDriveToCreateInput,
} from "@/lib/demoDriveMappers";
import { getCurrentAuthUserId } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import type { DemoDriveFormValues } from "@/types";

function getDemoDriveFormFromPayload(body: Record<string, unknown>) {
  const formSource = readRecord(body.form);
  const topLevelVehicleSlug = readString(body.vehicleSlug);
  const nestedVehicleSlug = readString(formSource.vehicleSlug);

  return {
    vehicleSlug: nestedVehicleSlug || topLevelVehicleSlug,
    fullName: readString(formSource.fullName),
    email: readString(formSource.email),
    phone: readString(formSource.phone),
    location: readString(formSource.location),
    preferredDate: readString(formSource.preferredDate),
    preferredTimeSlot: readString(formSource.preferredTimeSlot),
  } satisfies DemoDriveFormValues;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return createApiErrorResponse(
      "INVALID_DEMO_DRIVE_REQUEST",
      "Unable to process the demo drive request.",
      { status: 400 }
    );
  }

  if (!isRecord(body)) {
    return createApiErrorResponse(
      "INVALID_DEMO_DRIVE_PAYLOAD",
      "A valid demo drive payload is required.",
      { status: 400 }
    );
  }

  const form = getDemoDriveFormFromPayload(body);
  const validation = validateDemoDriveForm(form);

  if (!validation.isValid) {
    return createApiErrorResponse(
      "INVALID_DEMO_DRIVE_FORM",
      "Review the demo drive request and try again.",
      {
        details: validation.errors,
        status: 400,
      }
    );
  }

  const submittedAt = readString(body.submittedAt) || new Date().toISOString();
  const referenceId =
    readString(body.referenceId) ||
    createDemoDriveReferenceId(validation.form.vehicleSlug);

  try {
    const prisma = getPrismaClient();
    const currentUserId = await getCurrentAuthUserId();
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        slug: validation.form.vehicleSlug,
      },
    });

    if (!vehicle) {
      return createApiErrorResponse(
        "DEMO_DRIVE_VEHICLE_NOT_FOUND",
        "The selected vehicle is no longer available.",
        { status: 404 }
      );
    }

    const demoDriveRequest = await prisma.demoDriveRequest.create({
      data: mapValidatedDemoDriveToCreateInput(
        validation,
        vehicle,
        referenceId,
        submittedAt,
        currentUserId
      ),
    });

    return createApiSuccessResponse(
      mapPersistedDemoDriveToConfirmation(demoDriveRequest),
      { status: 201 }
    );
  } catch {
    return createApiErrorResponse(
      "DEMO_DRIVE_PERSIST_FAILED",
      "Unable to save the demo drive request right now.",
      { status: 500 }
    );
  }
}
