"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { demoDriveTimeSlots } from "@/constants/demoDrive";
import { ROUTES } from "@/constants/routes";
import { createDemoDrivePayload, submitDemoDrivePayload, validateDemoDriveForm } from "@/lib/demoDrive";
import { ApiRequestError } from "@/lib/fetcher";
import {
  getDemoDriveStorageKey,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  DemoDriveConfirmation,
  DemoDriveFormValues,
  DemoDriveValidationError,
  PersistedDemoDriveDraft,
  Vehicle,
} from "@/types";

type DemoDriveFormProps = {
  vehicle: Vehicle;
};

type DemoDriveDraftState = Omit<DemoDriveFormValues, "vehicleSlug">;

type FieldConfig = {
  autoComplete?: string;
  id: Exclude<keyof DemoDriveDraftState, "preferredTimeSlot">;
  label: string;
  placeholder: string;
  type: "date" | "email" | "tel" | "text";
};

const formFields: FieldConfig[] = [
  {
    id: "fullName",
    label: "Full name",
    placeholder: "Enter your full name",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    autoComplete: "email",
  },
  {
    id: "phone",
    label: "Phone number",
    placeholder: "Enter your phone number",
    type: "tel",
    autoComplete: "tel",
  },
  {
    id: "location",
    label: "ZIP code or city",
    placeholder: "Enter ZIP code or city",
    type: "text",
    autoComplete: "postal-code",
  },
  {
    id: "preferredDate",
    label: "Preferred date",
    placeholder: "",
    type: "date",
  },
];

const initialFormState: DemoDriveDraftState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  preferredDate: "",
  preferredTimeSlot: demoDriveTimeSlots[0].label,
};

function formatDate(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getStoredString(
  draft: Record<string, unknown>,
  key: string,
  fallback = ""
) {
  return typeof draft[key] === "string" ? (draft[key] as string) : fallback;
}

function getFieldError(
  errors: DemoDriveValidationError[],
  field: DemoDriveValidationError["field"]
) {
  return errors.find((error) => error.field === field)?.message;
}

function isDemoDriveValidationError(
  value: unknown
): value is DemoDriveValidationError {
  return (
    typeof value === "object" &&
    value !== null &&
    "field" in value &&
    "message" in value &&
    typeof value.field === "string" &&
    typeof value.message === "string"
  );
}

export function DemoDriveForm({ vehicle }: DemoDriveFormProps) {
  const prefersReducedMotion = useReducedMotion();
  const demoDriveStorageKey = getDemoDriveStorageKey(vehicle.slug);
  const hasRestoredDraftRef = useRef(false);
  const [formState, setFormState] = useState<DemoDriveDraftState>(initialFormState);
  const [confirmation, setConfirmation] = useState<DemoDriveConfirmation | null>(
    null
  );
  const [errors, setErrors] = useState<DemoDriveValidationError[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedDraft =
      safeLocalStorageGet<Record<string, unknown>>(demoDriveStorageKey);

    if (!storedDraft) {
      hasRestoredDraftRef.current = true;
      return;
    }

    const legacyPhone = getStoredString(storedDraft, "phoneNumber");
    const nextDraft: DemoDriveDraftState = {
      fullName: getStoredString(
        storedDraft,
        "fullName",
        initialFormState.fullName
      ),
      email: getStoredString(storedDraft, "email", initialFormState.email),
      phone: getStoredString(storedDraft, "phone", legacyPhone || initialFormState.phone),
      location: getStoredString(
        storedDraft,
        "location",
        initialFormState.location
      ),
      preferredDate: getStoredString(
        storedDraft,
        "preferredDate",
        initialFormState.preferredDate
      ),
      preferredTimeSlot: demoDriveTimeSlots.some(
        (slot) =>
          slot.label ===
          getStoredString(
            storedDraft,
            "preferredTimeSlot",
            initialFormState.preferredTimeSlot
          )
      )
        ? getStoredString(
            storedDraft,
            "preferredTimeSlot",
            initialFormState.preferredTimeSlot
          )
        : initialFormState.preferredTimeSlot,
    };

    const frame = window.requestAnimationFrame(() => {
      setFormState(nextDraft);
      hasRestoredDraftRef.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [demoDriveStorageKey]);

  useEffect(() => {
    if (!hasRestoredDraftRef.current) {
      return;
    }

    safeLocalStorageSet(
      demoDriveStorageKey,
      formState satisfies PersistedDemoDriveDraft
    );
  }, [demoDriveStorageKey, formState]);

  function clearFeedback() {
    setConfirmation(null);
    setErrors([]);
    setSubmissionError(null);
  }

  function handleFieldChange(
    field: keyof DemoDriveDraftState,
    value: DemoDriveDraftState[keyof DemoDriveDraftState]
  ) {
    clearFeedback();

    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formValues: DemoDriveFormValues = {
      vehicleSlug: vehicle.slug,
      ...formState,
    };
    const validation = validateDemoDriveForm(formValues);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmissionError("Review the highlighted fields before submitting.");
      setConfirmation(null);
      return;
    }

    const payload = createDemoDrivePayload(validation);

    setIsSubmitting(true);
    setErrors([]);
    setSubmissionError(null);

    try {
      const nextConfirmation = await submitDemoDrivePayload(payload);

      setConfirmation(nextConfirmation);
      safeLocalStorageRemove(demoDriveStorageKey);
    } catch (error) {
      const nextErrors =
        error instanceof ApiRequestError && Array.isArray(error.details)
          ? error.details.filter(isDemoDriveValidationError)
          : [];

      setErrors(nextErrors);
      setSubmissionError(
        error instanceof ApiRequestError
          ? error.message
          : "Unable to prepare your demo drive request right now."
      );
      setConfirmation(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClearDraft() {
    safeLocalStorageRemove(demoDriveStorageKey);
    clearFeedback();
    setFormState(initialFormState);
  }

  const preferredTimeSlotError = getFieldError(errors, "preferredTimeSlot");

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
      <div className="border-b border-black/6 px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Demo Drive
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          Schedule your {vehicle.name}
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
          This is a frontend-only mock form. We validate your request, prepare a
          typed payload, and return a mock confirmation without real scheduling.
        </p>
      </div>

      <form
        noValidate
        className="space-y-8 px-6 py-6 sm:px-8"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5">
          {formFields.map((field) => {
            const errorMessage = getFieldError(errors, field.id);

            return (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                  className="text-sm font-semibold text-neutral-950"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  autoComplete={field.autoComplete}
                  value={formState[field.id]}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={
                    errorMessage ? `${field.id}-error` : undefined
                  }
                  onChange={(event) =>
                    handleFieldChange(field.id, event.target.value)
                  }
                  className={cn(
                    "h-12 w-full rounded-[1.2rem] border bg-white px-4 text-sm text-neutral-950 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:bg-neutral-50 focus:ring-4",
                    errorMessage
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-black/8 focus:border-neutral-950 focus:ring-black/6"
                  )}
                />
                {errorMessage ? (
                  <p
                    id={`${field.id}-error`}
                    className="text-sm leading-6 text-rose-700"
                  >
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-950">
            Preferred time slot
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {demoDriveTimeSlots.map((slot) => {
              const isSelected = formState.preferredTimeSlot === slot.label;

              return (
                <button
                  key={slot.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleFieldChange("preferredTimeSlot", slot.label)
                  }
                  className={cn(
                    "rounded-[1.25rem] border px-4 py-4 text-sm font-semibold transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/6",
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)]"
                      : "border-black/8 bg-white text-neutral-950 hover:border-black/16 hover:bg-neutral-50 hover:shadow-[0_14px_32px_rgba(17,17,17,0.06)] motion-safe:hover:-translate-y-px",
                    preferredTimeSlotError && !isSelected
                      ? "border-rose-300"
                      : null
                  )}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
          {preferredTimeSlotError ? (
            <p className="text-sm leading-6 text-rose-700">
              {preferredTimeSlotError}
            </p>
          ) : null}
        </fieldset>

        <AnimatePresence mode="wait">
          {confirmation ? (
            <motion.section
              key="demo-drive-confirmation"
              aria-labelledby="demo-drive-confirmation-heading"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.98 }
              }
              transition={{ duration: 0.22 }}
              className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_16px_34px_rgba(5,150,105,0.08)] sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <h3
                    id="demo-drive-confirmation-heading"
                    className="text-lg font-semibold tracking-tight text-emerald-900"
                  >
                    Your mock demo drive request is ready.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    This confirmation is mock-only. No real appointment or email
                    was created, and the saved draft on this device has been
                    cleared.
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Reference ID
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                    {confirmation.referenceId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Vehicle
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                    {vehicle.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Preferred date
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                    {formatDate(confirmation.preferredDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Preferred time slot
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                    {confirmation.preferredTimeSlot}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    ZIP code or city
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                    {confirmation.location}
                  </dd>
                </div>
              </dl>
            </motion.section>
          ) : submissionError ? (
            <motion.section
              key="demo-drive-error"
              aria-live="polite"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.98 }
              }
              transition={{ duration: 0.2 }}
              className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 shadow-[0_16px_34px_rgba(190,24,93,0.08)] sm:p-6"
            >
              <p className="text-sm font-semibold text-rose-900">
                {submissionError}
              </p>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
          >
            {isSubmitting ? "Preparing Request..." : "Schedule Demo Drive"}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 motion-safe:hover:-translate-y-px"
            onClick={handleClearDraft}
          >
            Clear Draft
          </Button>
          <ButtonLink
            href={ROUTES.vehicleDetails(vehicle.slug)}
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
          >
            Back to Vehicle Details
          </ButtonLink>
        </div>

        <div className="rounded-[1.25rem] border border-black/6 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-600">
          Draft details save automatically on this device for {vehicle.name} and
          clear after a successful mock submission.
        </div>
      </form>
    </aside>
  );
}
