import { formatPrice } from "@/lib/utils";
import { formatMonthlyMortgage } from "./helpers";
import styles from "./ProjectMortgage.module.css";

interface ProjectMortgageProps {
    price: number;
    ratePct?: number;
    years?: number;
}

export function ProjectMortgage({
    price,
    ratePct = 14,
    years = 20,
}: ProjectMortgageProps) {
    const monthly = formatMonthlyMortgage(price, ratePct, years);
    return (
        <div className={styles.strip}>
            <div className={styles.left}>
                <span className={styles.eyebrow}>Ипотека</span>
                <p className={styles.title}>
                    от{" "}
                    <span className={styles.amount}>
                        {formatPrice(monthly)}
                    </span>{" "}
                    в&nbsp;месяц
                </p>
                <p className={styles.note}>
                    Ставка {ratePct}% годовых, срок {years} лет, без
                    первоначального взноса.
                </p>
            </div>
            <a href="#lead" className={styles.cta}>
                Рассчитать ипотеку
            </a>
        </div>
    );
}
