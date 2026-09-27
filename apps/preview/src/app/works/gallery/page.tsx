import { Suspense } from "react";
import { listListedObjects } from "@/actions/catalog/list-objects";
import { unwrapAction } from "@/types/action";
import { CATALOG_LOADING } from "@/lib/copy";
import { WorksCatalogContainer } from "@/widgets/works-catalog/works-catalog.container";
import styles from "@/widgets/works-catalog/works-catalog.module.css";

export const metadata = {
    title: "Фотогалерея · Новый Коттедж",
};

export default async function WorksGalleryPage() {
    const { objects } = unwrapAction(await listListedObjects());

    return (
        <Suspense fallback={<p className={styles.loading}>{CATALOG_LOADING}</p>}>
            <WorksCatalogContainer objects={objects} />
        </Suspense>
    );
}
