import { Reveal } from "@/components/shared/Reveal";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { Button } from "@/components/ui/button";
import { resolveBackgroundImage } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
};

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  primaryButtonText,
  secondaryButtonText,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-neutral-900"
        style={{
          backgroundImage: resolveBackgroundImage(
            backgroundImage,
            "linear-gradient(180deg, rgba(17, 17, 17, 0.22) 0%, rgba(17, 17, 17, 0.48) 42%, rgba(17, 17, 17, 0.78) 100%)"
          ),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <StaggerGroup
            className="max-w-3xl space-y-4"
            delayChildren={0.05}
            staggerChildren={0.07}
          >
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="text-base font-medium text-white/85 sm:text-lg lg:text-xl">
              {subtitle}
            </p>
          </StaggerGroup>

          <Reveal
            delay={0.14}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              type="button"
              size="lg"
              className="h-11 w-full min-w-[220px] rounded-full bg-white px-8 text-sm font-semibold text-neutral-950 transition-[background-color,transform] duration-200 hover:bg-white/90 motion-safe:hover:-translate-y-px sm:w-auto"
            >
              {primaryButtonText}
            </Button>
            {secondaryButtonText ? (
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-11 w-full min-w-[220px] rounded-full border-white/25 bg-black/25 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-[background-color,color,transform] duration-200 hover:bg-black/35 hover:text-white motion-safe:hover:-translate-y-px sm:w-auto"
              >
                {secondaryButtonText}
              </Button>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
