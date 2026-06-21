import { NextResponse } from "next/server";
import type { LeadRequest } from "@/domain/lead";
import { isValidLead } from "@/domain/lead";

function maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return "***";
    return `***${digits.slice(-4)}`;
}

// Server-side only. When unset, the route falls back to logging so a submitted
// lead is never silently dropped (e.g. before the backend is deployed).
const API_URL = process.env.NCOTTAGE_API_URL;

function logFallback(lead: LeadRequest, reason: string) {
    console.info("[lead] received (fallback)", {
        reason,
        source: lead.source,
        name: lead.name,
        phone: maskPhone(lead.phone),
        project: lead.project,
        preferredTime: lead.preferredTime,
        hasComment: Boolean(lead.comment),
    });
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

    if (!API_URL) {
        logFallback(lead, "NCOTTAGE_API_URL is not set");
        return NextResponse.json({ ok: true });
    }

    let res: Response;
    try {
        res = await fetch(`${API_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lead),
        });
    } catch {
        // Backend unreachable: keep the lead in the server log and let the
        // user see success instead of failing the form.
        logFallback(lead, "backend unreachable");
        return NextResponse.json({ ok: true });
    }

    if (!res.ok) {
        let message = "Не удалось отправить заявку. Попробуйте ещё раз.";
        try {
            const data: unknown = await res.json();
            if (
                data &&
                typeof data === "object" &&
                "error" in data &&
                typeof (data as { error: unknown }).error === "string"
            ) {
                message = (data as { error: string }).error;
            }
        } catch {
            // keep default message
        }
        return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
}
