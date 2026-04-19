"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CitySelector } from "@/components/shared/CitySelector";
import type { City, CityCode, Phone } from "@/lib/constants";
import {
    ClockIcon,
    EmailIcon,
    PhoneIcon,
    SearchIcon,
} from "./icons";
import styles from "./Header.module.css";

interface HeaderProps {
    cities: City[];
    phones: Record<CityCode, Phone>;
    addresses: Record<CityCode, string>;
    email: string;
    workHours: string;
    activeCity: CityCode;
    onCityChange: (code: CityCode) => void;
    mobileMenuOpen?: boolean;
    onBurgerClick?: () => void;
}

export function Header({
    cities,
    phones,
    addresses,
    email,
    workHours,
    activeCity,
    onCityChange,
    mobileMenuOpen,
    onBurgerClick,
}: HeaderProps) {
    const activePhone = phones[activeCity];
    const address = addresses[activeCity];

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
                    <CitySelector
                        cities={cities}
                        activeCity={activeCity}
                        onCityChange={onCityChange}
                    />
                    <p className={styles.address}>{address}</p>
                </div>

                <div className={styles.contacts}>
                    <span className={styles.contactItem}>
                        <ClockIcon className={styles.contactIcon} />
                        <span>{workHours}</span>
                    </span>
                    <a
                        href={`mailto:${email}`}
                        className={`${styles.contactItem} ${styles.email}`}
                    >
                        <EmailIcon className={styles.contactIcon} />
                        <span>{email}</span>
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
                        href={`mailto:${email}`}
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
                    {onBurgerClick && (
                        <button
                            type="button"
                            aria-label={mobileMenuOpen ? "Закрыть меню" : "Меню"}
                            aria-expanded={mobileMenuOpen}
                            className={`${styles.mobileIcon} ${styles.burgerMobileIcon}`}
                            onClick={onBurgerClick}
                        >
                            <span
                                className={`${styles.burgerBars} ${mobileMenuOpen ? styles.burgerBarsOpen : ""}`}
                            >
                                <span />
                                <span />
                                <span />
                            </span>
                        </button>
                    )}
                </div>
            </Container>
        </header>
    );
}
