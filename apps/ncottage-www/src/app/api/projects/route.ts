import { NextResponse } from "next/server";
import { getProjects } from "@/data/projects";

// Публичный список проектов для клиентских компонентов (например SiteSearch),
// которым нужен доступ к каталогу на стороне браузера. Проксирует server-side
// fetch к ncottage-api, не раскрывая NCOTTAGE_API_URL в клиент.
export async function GET() {
    const projects = await getProjects();
    return NextResponse.json(projects);
}
