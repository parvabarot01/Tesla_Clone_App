type LoadingSectionProps = {
  title?: string;
  description?: string;
};

export function LoadingSection({
  title = "Loading...",
  description = "Please wait while we prepare this section.",
}: LoadingSectionProps) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[50svh] items-center justify-center bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="size-10 rounded-full border-2 border-neutral-200 border-t-neutral-950 motion-safe:animate-spin"
        />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
