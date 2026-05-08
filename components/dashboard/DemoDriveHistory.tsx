import { ArrowUpRight, CalendarCheck2, MapPin, Ticket } from "lucide-react";

import type { DashboardDemoDriveHistoryItem } from "@/lib/dashboard";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";

type DemoDriveHistoryProps = {
  demoDriveRequests: DashboardDemoDriveHistoryItem[];
};

export function DemoDriveHistory({
  demoDriveRequests,
}: DemoDriveHistoryProps) {
  return (
    <article className="rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
      <div className="border-b border-black/6 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Demo Drives
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              Saved requests
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Review your preferred visit details, saved locations, and request
              references tied to this account.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            {demoDriveRequests.length} saved
          </span>
        </div>
      </div>

      {demoDriveRequests.length === 0 ? (
        <div className="px-6 py-6 sm:px-8">
          <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-neutral-50 p-5 sm:p-6">
            <p className="text-lg font-semibold tracking-tight text-neutral-950">
              No demo-drive requests yet
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Submit a demo-drive request and it will appear here with the
              preferred date, time slot, and saved location.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={ROUTES.vehicles}
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
              >
                Explore Vehicles
              </ButtonLink>
              <ButtonLink
                href={ROUTES.compare}
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
              >
                Compare Models
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-6 py-6 sm:px-8">
          {demoDriveRequests.map((demoDriveRequest) => (
            <section
              key={demoDriveRequest.id}
              className="rounded-[1.75rem] border border-black/8 bg-neutral-50 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Request {demoDriveRequest.referenceId}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {demoDriveRequest.vehicleName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Submitted {demoDriveRequest.submittedAtFormatted}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-[1.4rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                  {demoDriveRequest.preferredDateFormatted}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <CalendarCheck2 className="h-4 w-4" />
                    Preferred Time
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {demoDriveRequest.preferredTimeSlot}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {demoDriveRequest.location}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    <Ticket className="h-4 w-4" />
                    Reference
                  </div>
                  <p className="mt-3 text-sm font-semibold text-neutral-950">
                    {demoDriveRequest.referenceId}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex w-fit rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Account linked
                </span>

                <ButtonLink
                  href={ROUTES.demoDrive(demoDriveRequest.vehicleSlug)}
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full px-6 text-sm font-semibold transition-[background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-px"
                >
                  Schedule Another
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
