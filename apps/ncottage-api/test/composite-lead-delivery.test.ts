// Unit test for CompositeLeadDelivery orchestration. Run: pnpm test
// Standalone (no framework): assertions via node:assert, executed by tsx.
import assert from "node:assert/strict";
import type { Lead } from "@prisma/client";
import { CompositeLeadDelivery } from "../src/leads/delivery/composite-lead-delivery.js";
import type { EmailLeadDelivery } from "../src/leads/delivery/email-lead-delivery.js";
import type { LeadDeliveryProvider } from "../src/leads/delivery/lead-delivery.port.js";
import type { TelegramLeadDelivery } from "../src/leads/delivery/telegram-lead-delivery.js";

interface MockProvider extends LeadDeliveryProvider {
    calls: number;
}

function mock(
    name: string,
    enabled: boolean,
    behavior: "ok" | "fail"
): MockProvider {
    return {
        name,
        enabled,
        calls: 0,
        async deliver() {
            this.calls += 1;
            if (behavior === "fail") throw new Error(`${name} failed`);
        },
    };
}

function compose(tg: MockProvider, em: MockProvider): CompositeLeadDelivery {
    return new CompositeLeadDelivery(
        tg as unknown as TelegramLeadDelivery,
        em as unknown as EmailLeadDelivery
    );
}

const lead = { id: "lead-1", source: "callback" } as unknown as Lead;

const cases: { name: string; run: () => Promise<void> }[] = [
    {
        name: "no providers enabled → resolves, nothing called",
        run: async () => {
            const tg = mock("telegram", false, "ok");
            const em = mock("email", false, "ok");
            await compose(tg, em).deliver(lead);
            assert.equal(tg.calls, 0);
            assert.equal(em.calls, 0);
        },
    },
    {
        name: "all enabled succeed → resolves, each called once",
        run: async () => {
            const tg = mock("telegram", true, "ok");
            const em = mock("email", true, "ok");
            await compose(tg, em).deliver(lead);
            assert.equal(tg.calls, 1);
            assert.equal(em.calls, 1);
        },
    },
    {
        name: "single enabled fails → throws with provider name",
        run: async () => {
            const tg = mock("telegram", true, "fail");
            const em = mock("email", false, "ok");
            await assert.rejects(
                () => compose(tg, em).deliver(lead),
                /telegram/
            );
        },
    },
    {
        name: "partial failure (one fails, one ok) → throws, both attempted",
        run: async () => {
            const tg = mock("telegram", true, "fail");
            const em = mock("email", true, "ok");
            await assert.rejects(
                () => compose(tg, em).deliver(lead),
                /telegram/
            );
            assert.equal(em.calls, 1, "succeeding provider still attempted");
        },
    },
    {
        name: "all fail → throws listing both",
        run: async () => {
            const tg = mock("telegram", true, "fail");
            const em = mock("email", true, "fail");
            await assert.rejects(
                () => compose(tg, em).deliver(lead),
                (e) => {
                    const msg = (e as Error).message;
                    return msg.includes("telegram") && msg.includes("email");
                }
            );
        },
    },
    {
        name: "disabled provider is skipped even if it would fail",
        run: async () => {
            const tg = mock("telegram", false, "fail");
            const em = mock("email", true, "ok");
            await compose(tg, em).deliver(lead);
            assert.equal(tg.calls, 0);
            assert.equal(em.calls, 1);
        },
    },
];

async function main() {
    let failed = 0;
    for (const c of cases) {
        try {
            await c.run();
            console.log(`✓ ${c.name}`);
        } catch (e) {
            failed += 1;
            console.log(`✗ ${c.name}\n  ${(e as Error).message}`);
        }
    }
    console.log(
        failed === 0
            ? "\nCOMPOSITE DELIVERY UNIT: ALL PASS"
            : `\nCOMPOSITE DELIVERY UNIT: ${failed} FAILURE(S)`
    );
    process.exit(failed === 0 ? 0 : 1);
}

void main();
