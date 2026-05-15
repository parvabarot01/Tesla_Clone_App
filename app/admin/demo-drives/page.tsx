import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ROUTES } from "@/constants/routes";
import { getAdminDemoDriveViewData } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin Demo Drives | Tesla Clone",
  description: "Review persisted demo-drive requests, scheduling details, and customer identity.",
};

export default async function AdminDemoDrivesPage() {
  const demoDriveRequests = await getAdminDemoDriveViewData();

  return (
    <>
      <Reveal className="max-w-3xl">
        <AdminSectionHeader
          eyebrow="Admin Demo Drives"
          title="Demo-Drive Requests"
          description="Inspect scheduling preferences, locations, and linked customer context from submitted demo-drive requests."
          badge={`${demoDriveRequests.length} total`}
        />
      </Reveal>

      <Reveal
        delay={0.06}
        as="article"
        className="rounded-[2rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]"
      >
        {demoDriveRequests.length === 0 ? (
          <div className="px-6 py-6 sm:px-8">
            <AdminEmptyState
              title="No demo-drive requests yet"
              description="Submitted demo-drive requests will appear here as soon as customers use the public request flow."
              actionHref={ROUTES.vehicles}
              actionLabel="Browse Vehicles"
            />
          </div>
        ) : (
          <div className="space-y-4 px-6 py-6 sm:px-8">
            {demoDriveRequests.map((demoDriveRequest) => (
              <section
                key={demoDriveRequest.id}
                className="rounded-[1.75rem] border border-black/8 bg-neutral-50 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Request {demoDriveRequest.referenceId}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                      {demoDriveRequest.vehicleName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Submitted {demoDriveRequest.submittedAtFormatted}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-black/8 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Preferred Slot
                    </p>
                    <p className="mt-2 text-base font-semibold tracking-tight text-neutral-950">
                      {demoDriveRequest.preferredTimeSlot}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Customer
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {demoDriveRequest.customerLabel}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {demoDriveRequest.customerSecondaryLabel}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Preferred Date
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {demoDriveRequest.preferredDateFormatted}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {demoDriveRequest.preferredTimeSlot}
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Location
                    </p>
                    <p className="mt-3 text-sm font-semibold text-neutral-950">
                      {demoDriveRequest.location}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Requested destination
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/6 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Record
                    </p>
                    <p className="mt-3 font-mono text-sm font-semibold text-neutral-950">
                      {demoDriveRequest.referenceId}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Persisted request reference
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </Reveal>
    </>
  );
}
