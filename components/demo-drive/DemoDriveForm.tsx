"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { demoDriveTimeSlots } from "@/constants/demoDrive";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

type DemoDriveFormProps = {
  vehicle: Vehicle;
};

type DemoDriveState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  preferredDate: string;
  preferredTimeSlot: string;
};

type FieldConfig = {
  autoComplete?: string;
  id: keyof DemoDriveState;
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
    id: "phoneNumber",
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

const initialFormState: DemoDriveState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  location: "",
  preferredDate: "",
  preferredTimeSlot: demoDriveTimeSlots[0].label,
};

type ConfirmationSummary = {
  location: string;
  preferredDate: string;
  preferredTimeSlot: string;
  vehicleName: string;
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

export function DemoDriveForm({ vehicle }: DemoDriveFormProps) {
  const [formState, setFormState] = useState<DemoDriveState>(initialFormState);
  const [confirmation, setConfirmation] = useState<ConfirmationSummary | null>(
    null
  );

  function handleFieldChange(
    field: keyof DemoDriveState,
    value: DemoDriveState[keyof DemoDriveState]
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setConfirmation({
      vehicleName: vehicle.name,
      preferredDate: formState.preferredDate,
      preferredTimeSlot: formState.preferredTimeSlot,
      location: formState.location,
    });
  }

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
          This is a frontend-only mock form for V0.1. Choose a date and time
          preference and we&apos;ll store your request locally in the page state.
        </p>
      </div>

      <form className="space-y-8 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
        <div className="grid gap-5">
          {formFields.map((field) => (
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
                onChange={(event) =>
                  handleFieldChange(field.id, event.target.value)
                }
                className="h-12 w-full rounded-[1.2rem] border border-black/8 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-black/5"
              />
            </div>
          ))}
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
                    "rounded-[1.25rem] border px-4 py-4 text-sm font-semibold transition-all",
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_16px_34px_rgba(17,17,17,0.16)]"
                      : "border-black/8 bg-white text-neutral-950 hover:border-black/16 hover:bg-neutral-50"
                  )}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {confirmation ? (
          <section
            aria-labelledby="demo-drive-confirmation-heading"
            className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 sm:p-6"
          >
            <h3
              id="demo-drive-confirmation-heading"
              className="text-lg font-semibold tracking-tight text-emerald-900"
            >
              Your demo drive request has been saved locally for V0.1.
            </h3>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Vehicle
                </dt>
                <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                  {confirmation.vehicleName}
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
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  ZIP code or city
                </dt>
                <dd className="mt-2 text-sm font-medium text-emerald-950 sm:text-base">
                  {confirmation.location}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="submit"
            size="lg"
            className="h-11 rounded-full px-6 text-sm font-semibold"
          >
            Schedule Demo Drive
          </Button>
          <ButtonLink
            href={ROUTES.vehicleDetails(vehicle.slug)}
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-semibold"
          >
            Back to Vehicle Details
          </ButtonLink>
        </div>
      </form>
    </aside>
  );
}
