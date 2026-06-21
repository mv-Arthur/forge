import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, LEGAL, PHONES } from "@/content/contacts";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Обработка персональных данных — Новый Коттедж",
    description:
        "Согласие на обработку персональных данных при отправке форм на сайте Новый Коттедж.",
    alternates: { canonical: "/personal-data" },
};

const consentSections = [
    {
        title: "Что означает согласие",
        text: "Нажимая кнопку отправки формы, пользователь свободно, своей волей и в своём интересе подтверждает согласие на обработку персональных данных оператором — ООО «Новый коттедж». Согласие действует для обработки обращения, подготовки ответа, консультации и дальнейшего сопровождения заявки.",
    },
    {
        title: "Какие данные передаются",
        text: "В формах сайта могут передаваться имя, телефон, адрес электронной почты, город, параметры будущего дома, комментарий к заявке и технические данные, необходимые для корректной работы сайта.",
    },
    {
        title: "Разрешённые действия с данными",
        text: "Оператор может собирать, записывать, систематизировать, хранить, уточнять, использовать, передавать уполномоченным подрядчикам, обезличивать, блокировать, удалять и уничтожать персональные данные в пределах целей обработки.",
    },
    {
        title: "Срок действия и отзыв",
        text: "Согласие действует до достижения целей обработки или до его отзыва пользователем. Отозвать согласие можно письменным обращением на электронную почту оператора. После отзыва компания прекращает обработку, если иное не требуется законом или договором.",
    },
];

const purposes = [
    "ответ на заявку и консультация по строительству дома",
    "подбор проекта, технологии и комплектации",
    "расчёт ориентировочной стоимости и подготовка коммерческого предложения",
    "запись на встречу, экскурсию или обратный звонок",
    "исполнение договора и подготовка документов",
];

const consentSteps = [
    "Пользователь отправляет форму на сайте",
    "Менеджер связывается по указанным контактам",
    "Компания готовит консультацию, расчёт или документы",
];

export default function PersonalDataPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Обработка персональных данных" },
                    ]}
                />

                <section className={styles.hero}>
                    <div>
                        <SectionHeading
                            eyebrow="Согласие пользователя"
                            title="Обработка"
                            titleAccent="персональных данных"
                            lead="Согласие применяется при отправке заявок, расчётов, форм обратной связи и записи на консультацию."
                            tone="h1"
                            align="left"
                        />
                    </div>
                    <aside className={styles.summaryCard}>
                        <span>Оператор данных</span>
                        <strong>ООО «Новый коттедж»</strong>
                        <p>
                            ОГРН {LEGAL.ogrn} · ИНН {LEGAL.inn} · КПП{" "}
                            {LEGAL.kpp}
                        </p>
                    </aside>
                </section>

                <section
                    className={styles.steps}
                    aria-label="Как применяется согласие"
                >
                    {consentSteps.map((step, index) => (
                        <article key={step} className={styles.stepCard}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{step}</p>
                        </article>
                    ))}
                </section>

                <div className={styles.grid}>
                    <article className={styles.mainCard}>
                        <p className={styles.updated}>
                            Редакция от 11 мая 2026 года
                        </p>
                        {consentSections.map((section, index) => (
                            <section
                                key={section.title}
                                className={styles.textBlock}
                            >
                                <div className={styles.textBlockHead}>
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2>{section.title}</h2>
                                </div>
                                <p>{section.text}</p>
                            </section>
                        ))}
                    </article>

                    <aside className={styles.sideCard}>
                        <h2>Цели обработки</h2>
                        <ul>
                            {purposes.map((purpose) => (
                                <li key={purpose}>{purpose}</li>
                            ))}
                        </ul>
                    </aside>

                    <section className={styles.contactCard}>
                        <div>
                            <span>Контакты</span>
                            <h2>Куда направить отзыв согласия</h2>
                            <p>
                                Отправьте письмо на почту оператора или
                                обратитесь в офис компании. В обращении укажите,
                                какие данные нужно уточнить, заблокировать или
                                удалить.
                            </p>
                        </div>
                        <div className={styles.links}>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                            <a href={`tel:${PHONES.spb.number}`}>
                                {PHONES.spb.display}
                            </a>
                            <Link href="/privacy">
                                Политика конфиденциальности
                            </Link>
                        </div>
                    </section>
                </div>
            </Container>
        </section>
    );
}
