import type { StaticImageData } from "next/image";
import fargo from "../assets/fargo.jpg";
import hill from "../assets/hill.jpg";
import kiskelovo from "../assets/kiskelovo.jpg";
import ownProject from "../assets/own-project.jpg";
import visit from "../assets/visit.jpg";
import type { HeroCardImageId, HeroContent, HeroPayload } from "../hero.types";

const CARD_IMAGES: Record<HeroCardImageId, StaticImageData> = {
    fargo,
    hill,
    visit,
    "own-project": ownProject,
    kiskelovo,
};

export function toHeroContent(payload: HeroPayload): HeroContent {
    return {
        heading: payload.heading,
        lead: payload.lead,
        cards: payload.cards.map((card) => ({
            href: card.href,
            image: CARD_IMAGES[card.image],
            title: card.title,
            subtitle: card.subtitle,
            cta: card.cta,
        })),
    };
}
