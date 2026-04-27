import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { resolveBackgroundImage } from "@/lib/utils";
import type { FeatureCard } from "@/types";

type FeatureGridProps = {
  cards: FeatureCard[];
};

export function FeatureGrid({ cards }: FeatureGridProps) {
  return (
    <section aria-labelledby="feature-grid-heading" className="bg-white pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="feature-grid-heading" className="sr-only">
          Featured highlights
        </h2>

        <StaggerGroup
          className="grid gap-6 lg:grid-cols-2"
          delayChildren={0.03}
          staggerChildren={0.08}
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[2rem] border border-black/6 bg-neutral-900 shadow-[0_16px_48px_rgba(17,17,17,0.12)] transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_22px_56px_rgba(17,17,17,0.16)]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
                style={{
                  backgroundImage: resolveBackgroundImage(
                    card.image,
                    "linear-gradient(180deg, rgba(17, 17, 17, 0.08) 0%, rgba(17, 17, 17, 0.2) 35%, rgba(17, 17, 17, 0.82) 100%)"
                  ),
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />

              <div className="relative z-10 w-full p-6 sm:p-8">
                <div className="max-w-md space-y-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-white/82 sm:text-base">
                    {card.description}
                  </p>
                  <div>
                    {card.href ? (
                      <ButtonLink
                        href={card.href}
                        size="lg"
                        className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                      >
                        {card.buttonText}
                      </ButtonLink>
                    ) : (
                      <Button
                        type="button"
                        size="lg"
                        className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                      >
                        {card.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
