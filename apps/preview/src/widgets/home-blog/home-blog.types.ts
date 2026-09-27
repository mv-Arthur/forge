export type HomeBlogItem = {
    title: string;
    hint: string;
    href: string;
    image: string;
};

export type HomeBlogViewProps = {
    eyebrow: string;
    heading: string;
    items: HomeBlogItem[];
};
