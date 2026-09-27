export class JobControl {
    readonly abort = new AbortController();
    paused = false;
    private unlock: (() => void) | null = null;
    private gate: Promise<void> = Promise.resolve();

    async checkpoint(): Promise<void> {
        if (this.abort.signal.aborted) throw cancelledError();
        if (this.paused) await this.gate;
        if (this.abort.signal.aborted) throw cancelledError();
    }

    pause(): boolean {
        if (this.paused || this.abort.signal.aborted) return false;
        this.paused = true;
        this.gate = new Promise((resolve) => {
            this.unlock = resolve;
        });
        return true;
    }

    resume(): boolean {
        if (!this.paused || this.abort.signal.aborted) return false;
        this.paused = false;
        this.unlock?.();
        this.unlock = null;
        this.gate = Promise.resolve();
        return true;
    }

    cancel(): boolean {
        if (this.abort.signal.aborted) return false;
        this.abort.abort();
        this.paused = false;
        this.unlock?.();
        this.unlock = null;
        return true;
    }

    fetch: typeof fetch = async (input, init) => {
        await this.checkpoint();
        return fetch(input, { ...init, signal: this.abort.signal });
    };
}

export function isCancelledError(error: unknown): boolean {
    if (error instanceof DOMException && error.name === "AbortError") return true;
    if (error instanceof Error && error.name === "AbortError") return true;
    if (error instanceof Error && error.message === "cancelled") return true;
    return false;
}

function cancelledError(): Error {
    const error = new Error("cancelled");
    error.name = "AbortError";
    return error;
}
