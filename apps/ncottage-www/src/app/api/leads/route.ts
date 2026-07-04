import { NextResponse } from "next/server";
import type { LeadRequest } from "@/domain/lead";
import { isValidLead } from "@/domain/lead";

// Управляющие символы: всё C0/C1-подобное. Для однострочных полей режем целиком,
// для многострочных оставляем табуляцию и перевод строки.
// eslint-disable-next-line no-control-regex
const CONTROL_ALL = /[\x00-\x1f\x7f]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_KEEP_NEWLINES = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

// Чистим пользовательский текст: убираем управляющие символы и обрезаем по длине.
// Для однострочных полей дополнительно схлопываем пробелы.
function sanitizeText(
    value: unknown,
    maxLen: number,
    singleLine: boolean
): string | undefined {
    if (typeof value !== "string") return undefined;
    let v = singleLine
        ? value.replace(CONTROL_ALL, " ").replace(/\s+/g, " ")
        : value.replace(CONTROL_KEEP_NEWLINES, "");
    v = v.trim().slice(0, maxLen);
    return v || undefined;
}

// Санитизируем свободные поля до валидации/пересылки на backend (F049).
function sanitizeLead(lead: Partial<LeadRequest>): Partial<LeadRequest> {
    return {
        ...lead,
        name: sanitizeText(lead.name, 120, true),
        comment: sanitizeText(lead.comment, 2000, false),
        project: sanitizeText(lead.project, 200, true),
        preferredTime: sanitizeText(lead.preferredTime, 100, true),
    };
}

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

    const lead = sanitizeLead((body ?? {}) as Partial<LeadRequest>);
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

    // Пробрасываем реальный IP клиента, чтобы троттлинг на backend считал по
    // посетителю, а не по одному IP www-прокси.
    const forwardedFor =
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip");

    let res: Response;
    try {
        res = await fetch(`${API_URL}/leads`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
            },
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
