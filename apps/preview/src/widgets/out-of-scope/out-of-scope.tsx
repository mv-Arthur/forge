import Link from "next/link";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import { NAV_WORKS } from "@/lib/copy";
import styles from "./out-of-scope.module.css";

interface Props {
    title: string;
    topic?: string;
}

export function OutOfScope({ title, topic }: Props) {
    return (
        <main>
            <Container className={styles.main}>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: "/" },
                        { label: title },
                    ]}
                />
                <div className={styles.copy}>
                    <div className={`eyebrow ${styles.eyebrow}`}>
                        Демонстрация
                    </div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.text}>
                        {topic
                            ? `Раздел «${topic}» есть на действующем сайте, но в эту демонстрацию не входит.`
                            : "Этот раздел есть на действующем сайте, но в эту демонстрацию не входит."}{" "}
                        Сейчас показываем готовые проекты и фотогалерею - чтобы
                        согласовать направление, а не собрать весь сайт целиком.
                    </p>

                    <div className={styles.box}>
                        <div className={styles.boxLabel}>Что можно посмотреть</div>
                        <div className={styles.actions}>
                            <Link
                                href="/projects"
                                className="btn btn-primary btn-lg"
                            >
                                Проекты
                            </Link>
                            <Link href="/works" className="btn btn-light btn-lg">
                                {NAV_WORKS}
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
