import type { LeadRequest } from "@/domain/lead";

export class LeadSubmitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LeadSubmitError";
    }
}

const DEFAULT_ERROR = "Не удалось отправить заявку. Попробуйте ещё раз.";

export async function submitLead(req: LeadRequest): Promise<void> {
    let res: Response;
    try {
        res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });
    } catch {
        throw new LeadSubmitError(
            "Нет соединения с сервером. Проверьте интернет и попробуйте снова."
        );
    }

    if (!res.ok) {
        let message = DEFAULT_ERROR;
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
        throw new LeadSubmitError(message);
    }
}
