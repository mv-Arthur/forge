import type {
    EngineeringArticleBlock,
    EngineeringTocItem,
} from "../engineering-article.types";

export function articleToc(
    blocks: EngineeringArticleBlock[],
): EngineeringTocItem[] {
    const items: EngineeringTocItem[] = [];
    for (const block of blocks) {
        if (block.type === "h2") {
            items.push({ id: block.id, text: block.text, level: 2 });
        } else if (block.type === "h3") {
            items.push({ id: block.id, text: block.text, level: 3 });
        }
    }
    return items;
}
