import { Container } from "@/components/ui/Container";
import styles from "./AdvantagesSection.module.css";

const ADVANTAGES = [
    {
        icon: "/images/advantages/i1.png",
        title: "Квалифицированные инженеры",
        text: "Делаем расчёт нагрузок и закладываем запас прочности, что бы дом получился надёжным и служил долго.",
    },
    {
        icon: "/images/advantages/i2.png",
        title: "Опытные строители",
        text: "Специалисты с высшим строительным образованием. Постоянные монтажные бригады с опытом более 10 лет.",
    },
    {
        icon: "/images/advantages/i3.png",
        title: "Прозрачное ценообразование",
        text: "Мы считаем строительные объёмы каждого проекта, а не привязываемся к квадратному метру",
    },
    {
        icon: "/images/advantages/i4.png",
        title: "Закрытая смета",
        text: "Никаких скрытых платежей и увеличения стоимости сверх оговоренных расходов",
    },
    {
        icon: "/images/advantages/i5.png",
        title: "Контроль качества",
        text: "Видеонаблюдение на объекте и надзор за соблюдением проектных решений",
    },
    {
        icon: "/images/advantages/i6.png",
        title: "Официально и с гарантиями",
        text: "Работаем по договору, в котором прописаны сроки выполнения работ и состав проекта.",
    },
];

export function AdvantagesSection() {
    return (
        <section
            className={styles.section}
            style={{
                backgroundImage: "url(/images/advantages/bg.png)",
            }}
        >
            <Container>
                <h2 className={styles.title}>
                    6 причин обратиться в компанию
                    &laquo;Новый коттедж&raquo;
                </h2>
                <p className={styles.subtitle}>
                    Наша миссия - обеспечить людей желающих перебраться жить
                    на природу недорогим, качественным загородным жильём.
                </p>
                <div className={styles.grid}>
                    {ADVANTAGES.map((adv) => (
                        <div key={adv.title} className={styles.card}>
                            <img
                                src={adv.icon}
                                alt=""
                                className={styles.icon}
                            />
                            <h3 className={styles.cardTitle}>{adv.title}</h3>
                            <p className={styles.cardText}>{adv.text}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
