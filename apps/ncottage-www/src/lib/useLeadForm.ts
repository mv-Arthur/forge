"use client";

import { useCallback, useState } from "react";
import type { LeadRequest } from "@/domain/lead";
import { LeadSubmitError, submitLead } from "@/lib/leads";

type LeadStatus = "idle" | "submitting" | "success" | "error";

export function useLeadForm() {
    const [status, setStatus] = useState<LeadStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (req: LeadRequest): Promise<boolean> => {
        setStatus("submitting");
        setError(null);
        try {
            await submitLead(req);
            setStatus("success");
            return true;
        } catch (err) {
            setStatus("error");
            setError(
                err instanceof LeadSubmitError
                    ? err.message
                    : "Не удалось отправить заявку. Попробуйте ещё раз."
            );
            return false;
        }
    }, []);

    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
    }, []);

    return {
        status,
        error,
        submit,
        reset,
        isSubmitting: status === "submitting",
        isSuccess: status === "success",
        isError: status === "error",
    };
}
