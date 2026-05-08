import "server-only";

import type {
  DemoDriveRequest as PersistedDemoDriveRequest,
  Vehicle as DbVehicle,
} from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import type { ValidatedDemoDriveForm } from "@/lib/demoDrive";
import type { DemoDriveConfirmation } from "@/types";

function parseSubmittedAt(submittedAt: string) {
  const parsedDate = new Date(submittedAt);

  return Number.isNaN(parsedDate.valueOf()) ? new Date() : parsedDate;
}

export function mapValidatedDemoDriveToCreateInput(
  validatedForm: Extract<ValidatedDemoDriveForm, { isValid: true }>,
  dbVehicle: DbVehicle,
  referenceId: string,
  submittedAt: string,
  userId?: string | null
) {
  return {
    referenceId,
    vehicleSlug: dbVehicle.slug,
    vehicleName: dbVehicle.name,
    fullName: validatedForm.form.fullName,
    email: validatedForm.form.email,
    phone: validatedForm.form.phone,
    location: validatedForm.form.location,
    preferredDate: validatedForm.form.preferredDate,
    preferredTimeSlot: validatedForm.form.preferredTimeSlot,
    submittedAt: parseSubmittedAt(submittedAt),
    ...(userId
      ? {
          user: {
            connect: {
              id: userId,
            },
          },
        }
      : {}),
  } satisfies Prisma.DemoDriveRequestCreateInput;
}

export function mapPersistedDemoDriveToConfirmation(
  demoDriveRequest: PersistedDemoDriveRequest
): DemoDriveConfirmation {
  return {
    accepted: true,
    referenceId: demoDriveRequest.referenceId,
    vehicleSlug: demoDriveRequest.vehicleSlug,
    vehicleName: demoDriveRequest.vehicleName,
    preferredDate: demoDriveRequest.preferredDate,
    preferredTimeSlot: demoDriveRequest.preferredTimeSlot,
    location: demoDriveRequest.location,
    submittedAt: demoDriveRequest.submittedAt.toISOString(),
  };
}
