import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { resolveBackgroundImage } from "@/lib/utils";
import type { PromoCard } from "@/types";

type PromoCardsProps = {
  cards: PromoCard[];
};

export function PromoCards({ cards }: PromoCardsProps) {
  return (
    <section aria-labelledby="promo-cards-heading" className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="promo-cards-heading" className="sr-only">
          Promotional cards
        </h2>

        <StaggerGroup
          className="grid gap-6 lg:grid-cols-2"
          delayChildren={0.02}
          staggerChildren={0.08}
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="group grid overflow-hidden rounded-[2rem] border border-black/6 bg-neutral-100 shadow-[0_12px_36px_rgba(17,17,17,0.08)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_18px_42px_rgba(17,17,17,0.12)] md:grid-cols-[minmax(0,1fr)_280px]"
            >
              <div className="flex flex-col justify-between gap-8 px-6 py-7 sm:px-8 sm:py-8">
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                    {card.title}
                  </h3>
                  <p className="max-w-md text-sm leading-6 text-neutral-600 sm:text-base">
                    {card.description}
                  </p>
                </div>

                <div>
                  {card.href ? (
                    <ButtonLink
                      href={card.href}
                      size="lg"
                      className="h-11 rounded-full px-6 text-sm font-semibold"
                    >
                      {card.buttonText}
                    </ButtonLink>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      className="h-11 rounded-full px-6 text-sm font-semibold"
                    >
                      {card.buttonText}
                    </Button>
                  )}
                </div>
              </div>

              <div
                role="img"
                aria-label={`${card.title} placeholder image`}
                className="min-h-[240px] bg-neutral-300 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02] md:min-h-full"
                style={{
                  backgroundImage: resolveBackgroundImage(
                    card.image,
                    "linear-gradient(160deg, rgba(255, 255, 255, 0.18), rgba(17, 17, 17, 0.12))"
                  ),
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </article>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
