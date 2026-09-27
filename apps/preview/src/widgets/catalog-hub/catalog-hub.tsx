import Link from "next/link";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { HUB_BREADCRUMB } from "@/lib/copy";
import { routes } from "@/lib/routes";
import type { CatalogHubPayload } from "./catalog-hub.types";
import { CatalogHubIllustration } from "./__illustration/catalog-hub__illustration";
import { CatalogHubSection } from "./__section/catalog-hub__section";
import { CatalogHubMore } from "./__more/catalog-hub__more";
import { CatalogHubTech } from "./__tech/catalog-hub__tech";
import styles from "./catalog-hub.module.css";

function ChooseArrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5L20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CatalogHub({ payload }: { payload: CatalogHubPayload }) {
    return (
        <main>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: routes.home },
                        { label: HUB_BREADCRUMB },
                    ]}
                />
            </Container>
            <div className={styles.page} data-section="catalog-hub">
                <Container className={styles.inner}>
                    <section data-section="catalog-top" className={styles.top}>
                        <div className={styles.topCopy}>
                            <h1 className={styles.heading}>{payload.heading}</h1>
                            <p className={styles.lead}>{payload.lead}</p>
                            <Link
                                href={payload.chooseHref}
                                className={styles.choose}
                            >
                                {payload.chooseLabel}
                                <span className={styles.chooseIcon}>
                                    <ChooseArrow />
                                </span>
                            </Link>
                        </div>
                        <CatalogHubIllustration />
                    </section>
                    {payload.types.length > 0 ? (
                        <section
                            data-section="catalog-types"
                            className={styles.sections}
                        >
                            {payload.types.map((card, i) => (
                                <CatalogHubSection
                                    key={card.kind}
                                    card={card}
                                    priority={i < 2}
                                />
                            ))}
                        </section>
                    ) : null}
                    {payload.techs.length > 0 ? (
                        <>
                            <h2
                                data-section="catalog-techs-title"
                                className={styles.techsTitle}
                            >
                                {payload.techsHeading}
                            </h2>
                            <section
                                data-section="catalog-techs"
                                className={styles.techs}
                            >
                                {payload.techs.map((card, i) => (
                                    <CatalogHubTech
                                        key={card.tech}
                                        card={card}
                                        priority={i < 2}
                                    />
                                ))}
                            </section>
                            {payload.more ? (
                                <CatalogHubMore more={payload.more} />
                            ) : null}
                        </>
                    ) : null}
                </Container>
            </div>
        </main>
    );
}
