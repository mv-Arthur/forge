import { Container } from "@/ui/container";
import styles from "./illustration-gallery.module.css";

const VARIANTS = [
    {
        id: "elevation",
        title: "Фасад",
        note: "длинный объём, линия земли",
        src: "/images/catalog-drawings/elevation.svg",
    },
    {
        id: "pavilion",
        title: "Павильон",
        note: "каркас и крыша в перспективе",
        src: "/images/catalog-drawings/pavilion.svg",
    },
    {
        id: "site",
        title: "Участок",
        note: "пятно дома, дорожка, кроны",
        src: "/images/catalog-drawings/site.svg",
    },
    {
        id: "contour",
        title: "Рельеф",
        note: "горизонтали и контур дома",
        src: "/images/catalog-drawings/contour.svg",
    },
    {
        id: "explode",
        title: "Разборка",
        note: "крыша, стены, плита",
        src: "/images/catalog-drawings/explode.svg",
    },
    {
        id: "section",
        title: "Разрез",
        note: "склон и два этажа",
        src: "/images/catalog-drawings/section.svg",
    },
    {
        id: "layers",
        title: "Планы",
        note: "три листа друг на друге",
        src: "/images/catalog-drawings/layers.svg",
    },
    {
        id: "courtyard",
        title: "Двор",
        note: "план с внутренним двором",
        src: "/images/catalog-drawings/courtyard.svg",
    },
] as const;

export function CatalogHubIllustrationGallery() {
    return (
        <main className={styles.page}>
            <Container>
                <p className={styles.kicker}>
                    только выбор, на /catalog не влияет
                </p>
                <h1 className={styles.title}>Чертежи для каталога</h1>
                <p className={styles.lead}>
                    SVG. Напиши id — поставлю в слот на /catalog.
                </p>
                <div className={styles.grid}>
                    {VARIANTS.map((item) => (
                        <article key={item.id} className={styles.card}>
                            <div className={styles.meta}>
                                <h2 className={styles.name}>{item.title}</h2>
                                <code className={styles.id}>{item.id}</code>
                            </div>
                            <p className={styles.note}>{item.note}</p>
                            <div className={styles.slot}>
                                <img
                                    src={item.src}
                                    alt=""
                                    className={styles.drawing}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </main>
    );
}
