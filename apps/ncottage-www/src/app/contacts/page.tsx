import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactsMap } from "@/components/sections/ContactsMap";
import { CONTACT_FORM, CONTACTS_MAP } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Контакты — Новый Коттедж",
    description: "Свяжитесь с нами. Офисы в Санкт-Петербурге и Москве.",
};

export default function ContactsPage() {
    return (
        <>
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
            <ContactsMap
                title={CONTACTS_MAP.title}
                addresses={CONTACTS_MAP.addresses}
                phones={CONTACTS_MAP.phones}
                email={CONTACTS_MAP.email}
                hours={CONTACTS_MAP.hours}
                mapUrl={CONTACTS_MAP.mapUrl}
                mapTitle={CONTACTS_MAP.mapTitle}
            />
        </>
    );
}
