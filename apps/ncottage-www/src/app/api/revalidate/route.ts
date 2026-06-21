import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// On-demand ISR: ncottage-api дёргает этот секретный эндпоинт после мутаций
// контента, передавая теги/пути для точечной ревалидации кеша публичного сайта.
const SECRET = process.env.REVALIDATE_SECRET;

interface RevalidateBody {
    tags?: string[];
    paths?: string[];
}

export async function POST(request: Request) {
    if (!SECRET) {
        return NextResponse.json(
            { error: "Revalidation not configured" },
            { status: 503 }
        );
    }

    const provided =
        request.headers.get("x-revalidate-secret") ??
        new URL(request.url).searchParams.get("secret");
    if (provided !== SECRET) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: RevalidateBody = {};
    try {
        body = (await request.json()) as RevalidateBody;
    } catch {
        // пустое тело допустимо
    }

    const tags = Array.isArray(body.tags) ? body.tags : [];
    const paths = Array.isArray(body.paths) ? body.paths : [];
    for (const tag of tags) revalidateTag(tag);
    for (const path of paths) revalidatePath(path);

    return NextResponse.json({ revalidated: true, tags, paths });
}
