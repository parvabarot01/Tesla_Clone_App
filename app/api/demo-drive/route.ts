import {
  createApiErrorResponse,
  createApiSuccessResponse,
  isRecord,
  readString,
} from "@/lib/api";
import {
  createDemoDrivePayload,
  createDemoDriveReferenceId,
  validateDemoDriveForm,
} from "@/lib/demoDrive";
import type { DemoDriveFormValues } from "@/types";

function getDemoDriveFormFromPayload(body: Record<string, unknown>) {
  const formSource = isRecord(body.form) ? body.form : {};
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
  try {
    const body = (await request.json()) as unknown;

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

    const submittedAt = readString(body.submittedAt) || undefined;
    const payload = createDemoDrivePayload(validation, submittedAt);
    const confirmation = {
      accepted: true,
      referenceId: createDemoDriveReferenceId(payload.vehicleSlug),
      vehicleSlug: payload.vehicleSlug,
      preferredDate: payload.form.preferredDate,
      preferredTimeSlot: payload.form.preferredTimeSlot,
      location: payload.form.location,
    };

    return createApiSuccessResponse(confirmation);
  } catch {
    return createApiErrorResponse(
      "INVALID_DEMO_DRIVE_REQUEST",
      "Unable to process the demo drive request.",
      { status: 400 }
    );
  }
}
