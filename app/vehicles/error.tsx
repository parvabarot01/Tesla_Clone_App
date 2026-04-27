"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

type VehiclesErrorProps = {
  error: Error;
  reset: () => void;
};

export default function VehiclesError({ error, reset }: VehiclesErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <ErrorState
        title="Unable to load vehicles"
        description="We could not prepare the vehicle lineup."
        actionLabel="Back to Vehicles"
        actionHref={ROUTES.vehicles}
      />
      <div className="-mt-10 flex justify-center bg-neutral-50 px-4 pb-16">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full px-4"
          onClick={reset}
        >
          Try again
        </Button>
      </div>
    </>
  );
}
