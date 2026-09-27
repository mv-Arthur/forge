import { slotUrl } from "@/lib/homeSlots";
import type { HeroContent, HeroPayload } from "../hero.types";

export function toHeroContent(
    payload: HeroPayload,
    slots: Record<string, string>
): HeroContent {
    return {
        heading: payload.heading,
        lead: payload.lead,
        banner: slotUrl(slots, "hero.banner"),
        cards: payload.cards.map((card) => ({
            href: card.href,
            image: slotUrl(slots, `hero.${card.image}`),
            title: card.title,
            subtitle: card.subtitle,
            cta: card.cta,
        })),
        attributes: payload.attributes,
    };
}
