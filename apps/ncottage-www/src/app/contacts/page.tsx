import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import {
    ADDRESSES,
    CONTACT_FORM,
    EMAIL,
    PHONES,
    WORK_HOURS,
} from "@/lib/constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Контакты — Новый Коттедж",
    description: "Свяжитесь с нами. Офисы в Санкт-Петербурге и Москве.",
};

export default function ContactsPage() {
    return (
        <>
            <section className={styles.page}>
                <Container>
                    <SectionHeading
                        label="Контакты"
                        title="Свяжитесь с нами"
                        description="Приезжайте в офис или оставьте заявку — мы перезвоним."
                    />
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                Санкт-Петербург
                            </h3>
                            <a
                                href={`tel:${PHONES.spb.number}`}
                                className={styles.phone}
                            >
                                {PHONES.spb.display}
                            </a>
                            <p className={styles.address}>{ADDRESSES.spb}</p>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Москва</h3>
                            <a
                                href={`tel:${PHONES.msk.number}`}
                                className={styles.phone}
                            >
                                {PHONES.msk.display}
                            </a>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Email</h3>
                            <a
                                href={`mailto:${EMAIL}`}
                                className={styles.email}
                            >
                                {EMAIL}
                            </a>
                            <p className={styles.hours}>{WORK_HOURS}</p>
                        </div>
                    </div>
                </Container>
            </section>
            <ContactForm
                title={CONTACT_FORM.title}
                subtitle={CONTACT_FORM.subtitle}
                nameLabel={CONTACT_FORM.nameLabel}
                namePlaceholder={CONTACT_FORM.namePlaceholder}
                phoneLabel={CONTACT_FORM.phoneLabel}
                phonePlaceholder={CONTACT_FORM.phonePlaceholder}
                messageLabel={CONTACT_FORM.messageLabel}
                messagePlaceholder={CONTACT_FORM.messagePlaceholder}
                submitLabel={CONTACT_FORM.submitLabel}
                privacy={CONTACT_FORM.privacy}
                image={CONTACT_FORM.image}
                successTitle={CONTACT_FORM.successTitle}
                successText={CONTACT_FORM.successText}
            />
        </>
    );
}
