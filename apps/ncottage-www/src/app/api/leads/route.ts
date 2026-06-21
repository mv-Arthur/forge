import { NextResponse } from "next/server";
import type { LeadRequest } from "@/domain/lead";
import { isValidLead } from "@/domain/lead";

function maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return "***";
    return `***${digits.slice(-4)}`;
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Некорректный формат запроса." },
            { status: 400 }
        );
    }

    const lead = body as Partial<LeadRequest> | null;
    if (!isValidLead(lead)) {
        return NextResponse.json(
            { error: "Укажите корректный номер телефона." },
            { status: 400 }
        );
    }

    // TODO(backend): forward the lead to CRM / email / queue once the backend
    // exists. This handler is the single integration seam — only its body
    // needs to change. Until then we log on the server so a submitted lead is
    // never silently dropped in the browser.
    console.info("[lead] received", {
        source: lead.source,
        name: lead.name,
        phone: maskPhone(lead.phone),
        project: lead.project,
        preferredTime: lead.preferredTime,
        hasComment: Boolean(lead.comment),
    });

    return NextResponse.json({ ok: true });
}
