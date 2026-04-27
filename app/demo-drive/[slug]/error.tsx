"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

type DemoDriveErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DemoDriveError({ error, reset }: DemoDriveErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <ErrorState
        title="Unable to load demo drive"
        description="We could not prepare the demo drive request form."
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
