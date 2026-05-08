"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { ROUTES } from "@/constants/routes";

export default function DashboardError() {
  return (
    <ErrorState
      title="Unable to load the dashboard"
      description="Please try again in a moment or continue exploring the vehicle lineup."
      actionHref={ROUTES.vehicles}
      actionLabel="Browse Vehicles"
    />
  );
}
