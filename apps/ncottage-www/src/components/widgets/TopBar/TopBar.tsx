"use client";

import { Container } from "@/components/ui/Container";
import { CitySelector } from "@/components/shared/CitySelector";
import type { City, CityCode } from "@/content/contacts";
import styles from "./TopBar.module.css";

interface TopBarProps {
    cities: City[];
    activeCity: CityCode;
    onCityChange: (code: CityCode) => void;
    workHours: string;
    email: string;
}

export function TopBar({
    cities,
    activeCity,
    onCityChange,
    workHours,
    email,
}: TopBarProps) {
    return (
        <div className={styles.bar}>
            <Container className={styles.inner}>
                <div className={styles.left}>
                    <span className={styles.cityLabel}>Ваш город:</span>
                    <CitySelector
                        cities={cities}
                        activeCity={activeCity}
                        onCityChange={onCityChange}
                    />
                </div>
                <div className={styles.right}>
                    <span className={styles.item}>{workHours}</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <a href={`mailto:${email}`} className={styles.item}>
                        {email}
                    </a>
                </div>
            </Container>
        </div>
    );
}
