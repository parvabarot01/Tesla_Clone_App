import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { resolveBackgroundImage } from "@/lib/utils";
import type { EnergyCard } from "@/types";

type EnergySectionProps = {
  cards: EnergyCard[];
};

export function EnergySection({ cards }: EnergySectionProps) {
  return (
    <section
      id="energy"
      aria-labelledby="energy-section-heading"
      className="bg-white pb-20 pt-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="energy-section-heading" className="sr-only">
          Energy products
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className="relative isolate flex min-h-[520px] items-end overflow-hidden rounded-[2rem] border border-black/6 bg-neutral-900 shadow-[0_20px_54px_rgba(17,17,17,0.14)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                role="img"
                aria-label={`${card.title} placeholder image`}
                className="absolute inset-0"
                style={{
                  backgroundImage: resolveBackgroundImage(
                    card.image,
                    "linear-gradient(180deg, rgba(17, 17, 17, 0.06) 0%, rgba(17, 17, 17, 0.18) 38%, rgba(17, 17, 17, 0.82) 100%)"
                  ),
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />

              <div className="relative z-10 w-full p-6 sm:p-8">
                <div className="max-w-md space-y-4">
                  <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-white/82 sm:text-base">
                    {card.subtitle}
                  </p>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    {card.primaryHref ? (
                      <ButtonLink
                        href={card.primaryHref}
                        size="lg"
                        className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                      >
                        {card.primaryButtonText}
                      </ButtonLink>
                    ) : (
                      <Button
                        type="button"
                        size="lg"
                        className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                      >
                        {card.primaryButtonText}
                      </Button>
                    )}
                    {card.secondaryHref ? (
                      <ButtonLink
                        href={card.secondaryHref}
                        size="lg"
                        variant="outline"
                        className="h-11 rounded-full border-white/25 bg-black/20 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/32 hover:text-white"
                      >
                        {card.secondaryButtonText}
                      </ButtonLink>
                    ) : (
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="h-11 rounded-full border-white/25 bg-black/20 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/32 hover:text-white"
                      >
                        {card.secondaryButtonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
