import { getCatalogHub } from "@/actions/catalog/get-catalog-hub";
import { unwrapAction } from "@/types/action";
import { CatalogHub } from "@/widgets/catalog-hub/catalog-hub";

export const metadata = {
    title: `Каталог · Новый Коттедж`,
};

export default async function CatalogPage() {
    const { hub } = unwrapAction(await getCatalogHub());
    return <CatalogHub payload={hub} />;
}
