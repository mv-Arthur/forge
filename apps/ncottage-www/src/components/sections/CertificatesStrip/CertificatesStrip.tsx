import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./CertificatesStrip.module.css";

const ITEMS = [
    {
        value: "СРО",
        label: "Реестр добросовестных исполнителей",
    },
    {
        value: "7 сертификатов",
        label: "На материалы, пожаро- и экобезопасность",
    },
    {
        value: "Страховка СМР",
        label: "Объект застрахован на весь срок стройки",
    },
];

export function CertificatesStrip() {
    return (
        <section className={styles.section}>
            <Container className={styles.inner}>
                <div className={styles.head}>
                    <span className={styles.eyebrow}>Документы и гарантии</span>
                    <h2 className={styles.title}>
                        Проверьте нас до подписания договора
                    </h2>
                    <p className={styles.lead}>
                        Покажем сертификаты, лицензии и подтверждающие документы
                        — в офисе или вместе с коммерческим предложением.
                    </p>
                    <Link href="/certificates" className={styles.cta}>
                        Смотреть документы →
                    </Link>
                </div>
                <ul className={styles.list}>
                    {ITEMS.map((item) => (
                        <li key={item.label} className={styles.item}>
                            <span className={styles.value}>{item.value}</span>
                            <span className={styles.label}>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
