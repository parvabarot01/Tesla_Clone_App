import { cn } from "@/lib/utils";

type Spec = {
  label: string;
  value: string;
};

type SpecGridProps = {
  specs: Spec[];
  columns?: 2 | 3 | 4;
};

const columnClasses: Record<NonNullable<SpecGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

export function SpecGrid({ specs, columns = 4 }: SpecGridProps) {
  return (
    <dl className={cn("grid gap-5", columnClasses[columns])}>
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="rounded-[1.75rem] border border-black/6 bg-white px-6 py-7 shadow-[0_16px_40px_rgba(17,17,17,0.08)]"
        >
          <dd className="text-3xl font-semibold tracking-tight text-neutral-950">
            {spec.value}
          </dd>
          <dt className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            {spec.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
