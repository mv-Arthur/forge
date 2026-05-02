import { Container } from "@/components/ui/Container";
import type { PullQuoteContent } from "@/content/home";
import styles from "./PullQuote.module.css";

interface PullQuoteProps {
    quote: PullQuoteContent["quote"];
    author: PullQuoteContent["author"];
    role?: PullQuoteContent["role"];
}

export function PullQuote({ quote, author, role }: PullQuoteProps) {
    return (
        <section className={styles.section}>
            <Container>
                <figure className={styles.inner}>
                    <span className={styles.mark} aria-hidden="true" />
                    <blockquote className={styles.quote}>{quote}</blockquote>
                    <figcaption className={styles.author}>
                        <span className={styles.authorName}>{author}</span>
                        {role && (
                            <span className={styles.authorRole}>{role}</span>
                        )}
                    </figcaption>
                </figure>
            </Container>
        </section>
    );
}
