import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveDistrictUrl } from "./resolve-district-url.ts";

describe("resolveDistrictUrl", () => {
    it("opens Moscow maps and picks the first geo toponym", async () => {
        const calls: string[] = [];
        const html = `<script type="application/json">${JSON.stringify({
            config: { csrfToken: "csrf-1" },
        })}</script>`;
        const url = await resolveDistrictUrl("Москва, район Арбат", {
            fetch: async (input) => {
                const href = String(input);
                calls.push(href);
                if (href.includes("/maps/213/moscow")) {
                    return new Response(html, { status: 200 });
                }
                return new Response(
                    JSON.stringify({
                        data: {
                            items: [
                                {
                                    type: "toponym",
                                    id: "53000001",
                                    title: "район Арбат",
                                },
                            ],
                        },
                    }),
                    { status: 200 }
                );
            },
        });
        assert.equal(url, "https://yandex.ru/maps/?ol=geo&oid=53000001");
        assert.equal(calls.length, 2);
    });
});
