import type { ContactsMapContent } from "@/lib/constants";
import styles from "./ContactsMap.module.css";

interface ContactsMapProps {
    title: ContactsMapContent["title"];
    addresses: ContactsMapContent["addresses"];
    phones: ContactsMapContent["phones"];
    email: ContactsMapContent["email"];
    hours: ContactsMapContent["hours"];
    mapUrl: ContactsMapContent["mapUrl"];
    mapTitle: ContactsMapContent["mapTitle"];
}

export function ContactsMap({
    title,
    addresses,
    phones,
    email,
    hours,
    mapUrl,
    mapTitle,
}: ContactsMapProps) {
    return (
        <section className={styles.section}>
            <div className={styles.address}>
                <div className={styles.block}>
                    <h4 className={styles.title}>{title}</h4>
                    {addresses.map((line) => (
                        <div key={line} className={styles.item}>
                            {line}
                        </div>
                    ))}
                    <div className={styles.common}>
                        {phones.map((phone) => (
                            <a
                                key={phone.number}
                                href={`tel:${phone.number}`}
                                className={`${styles.commonItem} ${styles.phone}`}
                            >
                                {phone.display}
                            </a>
                        ))}
                        <a
                            href={`mailto:${email}`}
                            className={`${styles.commonItem} ${styles.email}`}
                        >
                            {email}
                        </a>
                        <div className={`${styles.commonItem} ${styles.time}`}>
                            {hours}
                        </div>
                    </div>
                </div>
            </div>
            <iframe
                className={styles.iframe}
                src={mapUrl}
                title={mapTitle}
                loading="lazy"
            />
        </section>
    );
}
