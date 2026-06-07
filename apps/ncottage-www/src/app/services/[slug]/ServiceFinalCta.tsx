import { PHONES } from "@/content/contacts";
import { ServiceCtaLink } from "./ServiceCtaLink";
import styles from "./ServiceFinalCta.module.css";

interface ServiceFinalCtaProps {
    serviceSlug: string;
    serviceTitle: string;
    title?: string;
    text?: string;
    requestLabel?: string;
    requestHref?: string;
    callLabel?: string;
    callHref?: string;
}

const DEFAULT_REQUEST_HREF = "/contacts#request";
const DEFAULT_PLACEMENT = "final";

export function ServiceFinalCta({
    serviceSlug,
    serviceTitle,
    title = "Обсудим ваш объект и следующий шаг",
    text,
    requestLabel = "Получить консультацию",
    requestHref = DEFAULT_REQUEST_HREF,
    callLabel = "Позвонить",
    callHref = `tel:${PHONES.spb.number}`,
}: ServiceFinalCtaProps) {
    const finalText =
        text ??
        `Разберём вводные по направлению «${serviceTitle.toLowerCase()}», покажем риски, порядок работ и что нужно для точного расчёта.`;

    return (
        <section
            className={styles.section}
            aria-labelledby={`${serviceSlug}-final-cta-title`}
        >
            <div className={styles.content}>
                <p className={styles.eyebrow}>Следующий шаг</p>
                <h2 id={`${serviceSlug}-final-cta-title`}>{title}</h2>
                <p>{finalText}</p>
            </div>

            <div className={styles.actions}>
                <ServiceCtaLink
                    className={styles.primaryButton}
                    href={requestHref}
                    serviceSlug={serviceSlug}
                    serviceTitle={serviceTitle}
                    action="request"
                    placement={DEFAULT_PLACEMENT}
                >
                    {requestLabel}
                </ServiceCtaLink>
                <ServiceCtaLink
                    className={styles.secondaryButton}
                    href={callHref}
                    serviceSlug={serviceSlug}
                    serviceTitle={serviceTitle}
                    action="call"
                    placement={DEFAULT_PLACEMENT}
                >
                    {callLabel}
                </ServiceCtaLink>
            </div>
        </section>
    );
}
