import Image from "next/image";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import {
    ENGINEERING_HUB_TITLE,
    ENGINEERING_CTA,
    NAV_SERVICES,
} from "@/lib/copy";
import { ENGINEERING_HUB_HREF, ENGINEERING_NAV } from "@/lib/engineering";
import { routes } from "@/lib/routes";
import { EngineeringArticleFigure } from "./__figure/engineering-article__figure";
import { EngineeringArticleLead } from "./__lead/engineering-article__lead";
import { EngineeringArticleNav } from "./__nav/engineering-article__nav";
import { EngineeringArticleToc } from "./__toc/engineering-article__toc";
import { getEngineeringArticle } from "./lib/content";
import { articleToc } from "./lib/toc";
import type {
    EngineeringArticleBlock,
    EngineeringArticleProps,
} from "./engineering-article.types";
import styles from "./engineering-article.module.css";

function Block({ block }: { block: EngineeringArticleBlock }) {
    if (block.type === "h2") {
        return (
            <h2 id={block.id} className={styles.h2}>
                {block.text}
            </h2>
        );
    }
    if (block.type === "h3") {
        return (
            <h3 id={block.id} className={styles.h3}>
                {block.text}
            </h3>
        );
    }
    if (block.type === "p") {
        return <p className={styles.p}>{block.text}</p>;
    }
    if (block.type === "ul") {
        return (
            <ul className={styles.ul}>
                {block.items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        );
    }
    if (block.type === "table") {
        return (
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <caption className={styles.caption}>{block.caption}</caption>
                    <tbody>
                        {block.rows.map((row) => (
                            <tr key={row.label}>
                                <th scope="row">{row.label}</th>
                                <td>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    if (block.type === "image") {
        return (
            <div className={styles.photo}>
                <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    unoptimized
                    sizes="(min-width:992px) 720px, 100vw"
                    className={styles.image}
                />
            </div>
        );
    }
    return (
        <EngineeringArticleFigure kind={block.kind} caption={block.caption} />
    );
}

export function EngineeringArticle({ page, form }: EngineeringArticleProps) {
    const article = getEngineeringArticle(page);
    const toc = articleToc(article.blocks);

    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: NAV_SERVICES, href: routes.services },
                        {
                            label: ENGINEERING_HUB_TITLE,
                            href: ENGINEERING_HUB_HREF,
                        },
                        {
                            label:
                                ENGINEERING_NAV.find((item) => item.slug === page)
                                    ?.label ?? article.title,
                        },
                    ]}
                />
            </Container>
            <Container className={styles.page}>
                <div className={styles.layout} data-section="engineering-article">
                    <aside className={styles.aside}>
                        <EngineeringArticleToc items={toc} />
                        <EngineeringArticleNav current={page} />
                    </aside>
                    <article className={styles.article}>
                        <h1 className={styles.title}>{article.title}</h1>
                        <p className={styles.lead}>{article.lead}</p>
                        <a href="#lead" className={`btn btn-primary ${styles.cta}`}>
                            {ENGINEERING_CTA}
                        </a>
                        {article.offer.length > 0 ? (
                            <ul className={styles.offer}>
                                {article.offer.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : null}
                        {article.blocks.map((block, index) => (
                            <Block
                                key={
                                    block.type === "h2" || block.type === "h3"
                                        ? block.id
                                        : `${block.type}-${index}`
                                }
                                block={block}
                            />
                        ))}
                    </article>
                </div>
                <EngineeringArticleLead form={form} />
            </Container>
        </main>
    );
}
