export type HeroCardImageId =
    | "fargo"
    | "hill"
    | "visit"
    | "own-project"
    | "kiskelovo";

export type HeroCardPayload = {
    href: string;
    image: HeroCardImageId;
    title: string;
    subtitle?: string;
    cta: string;
};

export type HeroPayload = {
    heading: string;
    lead: string;
    cards: HeroCardPayload[];
};
