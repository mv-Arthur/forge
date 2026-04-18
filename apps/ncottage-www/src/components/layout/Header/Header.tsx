"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import {
    PHONES,
    EMAIL,
    ADDRESSES,
    WORK_HOURS,
} from "@/lib/constants";
import {
    ChevronDownIcon,
    ClockIcon,
    EmailIcon,
    PhoneIcon,
    SearchIcon,
} from "./icons";
import styles from "./Header.module.css";

type CityCode = "spb" | "msk";

const CITIES: { code: CityCode; label: string }[] = [
    { code: "spb", label: "Санкт-Петербург" },
    { code: "msk", label: "Москва" },
];

export function Header() {
    const [city, setCity] = useState<CityCode>("spb");
    const [cityOpen, setCityOpen] = useState(false);

    const activePhone = PHONES[city];
    const address = ADDRESSES[city];
    const activeCityLabel = CITIES.find((c) => c.code === city)?.label;

    return (
        <header className={styles.header}>
            <Container className={styles.topBarInner}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/images/logo.png"
                        alt="Новый Коттедж"
                        width={160}
                        height={45}
                        priority
                    />
                </Link>

                <div className={styles.cityBlock}>
                    <span className={styles.cityLabel}>Как найти нас:</span>
                    <div className={styles.cityRow}>
                        <button
                            type="button"
                            className={styles.citySelect}
                            onClick={() => setCityOpen((v) => !v)}
                            aria-haspopup="listbox"
                            aria-expanded={cityOpen}
                        >
                            <span>{activeCityLabel}</span>
                            <ChevronDownIcon className={styles.cityChevron} />
                        </button>
                        {cityOpen && (
                            <ul className={styles.cityOptions} role="listbox">
                                {CITIES.map((c) => (
                                    <li
                                        key={c.code}
                                        className={styles.cityOption}
                                        role="option"
                                        aria-selected={c.code === city}
                                        onClick={() => {
                                            setCity(c.code);
                                            setCityOpen(false);
                                        }}
                                    >
                                        {c.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <p className={styles.address}>{address}</p>
                </div>

                <div className={styles.contacts}>
                    <span className={styles.contactItem}>
                        <ClockIcon className={styles.contactIcon} />
                        <span>{WORK_HOURS}</span>
                    </span>
                    <a
                        href={`mailto:${EMAIL}`}
                        className={`${styles.contactItem} ${styles.email}`}
                    >
                        <EmailIcon className={styles.contactIcon} />
                        <span>{EMAIL}</span>
                    </a>
                </div>

                <div className={styles.phones}>
                    <div className={styles.phoneRow}>
                        <PhoneIcon className={styles.phoneIcon} />
                        <a
                            href={`tel:${activePhone.number}`}
                            className={styles.phone}
                        >
                            {activePhone.display}
                        </a>
                    </div>
                    <button type="button" className={styles.callBtn}>
                        Заказать звонок
                    </button>
                </div>

                <div className={styles.mobileIcons}>
                    <a
                        href={`tel:${activePhone.number}`}
                        aria-label="Позвонить"
                        className={styles.mobileIcon}
                    >
                        <PhoneIcon />
                    </a>
                    <a
                        href={`mailto:${EMAIL}`}
                        aria-label="Написать"
                        className={styles.mobileIcon}
                    >
                        <EmailIcon />
                    </a>
                    <button
                        type="button"
                        aria-label="Поиск"
                        className={`${styles.mobileIcon} ${styles.searchMobileIcon}`}
                    >
                        <SearchIcon />
                    </button>
                </div>
            </Container>
        </header>
    );
}
