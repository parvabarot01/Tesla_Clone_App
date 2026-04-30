import { API_ROUTES } from "@/constants/api";
import { demoDriveTimeSlots } from "@/constants/demoDrive";
import { getVehicleBySlug as getLocalVehicleBySlug } from "@/data/vehicles";
import { fetchApiJson } from "@/lib/fetcher";
import type {
  DemoDriveConfirmation,
  DemoDriveFormValues,
  DemoDrivePayload,
  DemoDriveValidationError,
  Vehicle,
} from "@/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidatedDemoDriveForm =
  | {
      errors: [];
      form: DemoDriveFormValues;
      isValid: true;
      vehicle: Vehicle;
    }
  | {
      errors: DemoDriveValidationError[];
      form: DemoDriveFormValues;
      isValid: false;
    };

function normalizeDemoDriveFormValues(
  formValues: DemoDriveFormValues
): DemoDriveFormValues {
  return {
    vehicleSlug: formValues.vehicleSlug.trim(),
    fullName: formValues.fullName.trim(),
    email: formValues.email.trim(),
    phone: formValues.phone.trim(),
    location: formValues.location.trim(),
    preferredDate: formValues.preferredDate.trim(),
    preferredTimeSlot: formValues.preferredTimeSlot.trim(),
  };
}

export function validateDemoDriveForm(
  formValues: DemoDriveFormValues
): ValidatedDemoDriveForm {
  const normalizedForm = normalizeDemoDriveFormValues(formValues);
  const errors: DemoDriveValidationError[] = [];
  const vehicle = getLocalVehicleBySlug(normalizedForm.vehicleSlug);
  const isValidTimeSlot = demoDriveTimeSlots.some(
    (slot) => slot.label === normalizedForm.preferredTimeSlot
  );

  if (!vehicle) {
    errors.push({
      field: "vehicleSlug",
      message: "Choose a valid vehicle before submitting your demo drive request.",
    });
  }

  if (!normalizedForm.fullName) {
    errors.push({
      field: "fullName",
      message: "Enter your full name.",
    });
  }

  if (!normalizedForm.email) {
    errors.push({
      field: "email",
      message: "Enter your email address.",
    });
  } else if (!emailPattern.test(normalizedForm.email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address.",
    });
  }

  if (!normalizedForm.phone) {
    errors.push({
      field: "phone",
      message: "Enter your phone number.",
    });
  }

  if (!normalizedForm.location) {
    errors.push({
      field: "location",
      message: "Enter a ZIP code or city.",
    });
  }

  if (!normalizedForm.preferredDate) {
    errors.push({
      field: "preferredDate",
      message: "Choose a preferred date.",
    });
  }

  if (!normalizedForm.preferredTimeSlot || !isValidTimeSlot) {
    errors.push({
      field: "preferredTimeSlot",
      message: "Choose a valid preferred time slot.",
    });
  }

  if (!vehicle) {
    return {
      isValid: false,
      errors,
      form: normalizedForm,
    };
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      form: normalizedForm,
    };
  }

  return {
    isValid: true,
    errors: [],
    form: normalizedForm,
    vehicle,
  };
}

export function createDemoDrivePayload(
  validatedForm: Extract<ValidatedDemoDriveForm, { isValid: true }>,
  submittedAt = new Date().toISOString()
): DemoDrivePayload {
  return {
    vehicleSlug: validatedForm.vehicle.slug,
    vehicleName: validatedForm.vehicle.name,
    form: validatedForm.form,
    submittedAt,
  };
}

export function createDemoDriveReferenceId(vehicleSlug: string) {
  const normalizedSlug = vehicleSlug.replace(/[^a-z0-9]+/gi, "").toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();

  return `DD-${normalizedSlug}-${timestamp}`;
}

export async function submitDemoDrivePayload(payload: DemoDrivePayload) {
  return fetchApiJson<DemoDriveConfirmation>(API_ROUTES.demoDrive, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
