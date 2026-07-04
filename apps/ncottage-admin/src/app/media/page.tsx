import { PageHeader } from "@/components/page-header";
import { MediaLibrary } from "./MediaLibrary";
import { listMediaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
    const { items, total } = await listMediaAction({ take: 200 });

    return (
        <div>
            <PageHeader title="Медиа" description={`Файлов: ${total}`} />
            <MediaLibrary initial={items} />
        </div>
    );
}
