import type { CopyBlock, CopyRole, CopySlot } from "./types.js";
import type { RawCopyNode } from "./collect.js";

const MAX_TEXT = 500;

function norm(s: string): string {
    return s.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
}

function isHeading(n: RawCopyNode): boolean {
    return n.tag === "H1" || n.tag === "H2" || n.tag === "H3";
}

function headingRole(n: RawCopyNode): CopyRole {
    if (n.tag === "H1") return "h1";
    if (n.tag === "H2") return "h2";
    return "h3";
}

export function isNumericText(s: string): boolean {
    const t = s.replace(/\s/g, "");
    return /^\d+([.,]\d+)?%?$/.test(t);
}

function isKpiLabel(n: RawCopyNode): boolean {
    if (isHeading(n) || n.isButton) return false;
    const t = norm(n.text);
    if (t.length < 2 || t.length > 48) return false;
    if (isNumericText(n.ownText || t)) return false;
    return true;
}

function push(
    blocks: CopyBlock[],
    seen: Set<string>,
    block: CopyBlock,
): void {
    const text = norm(block.text);
    if (!text) return;
    const href = block.href;
    const key = `${block.role}|${block.slot}|${text}|${href ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push({ ...block, text, href });
}

/** Map raw DOM nodes to copy blocks. */
export function blocksFromRaw(nodes: RawCopyNode[]): CopyBlock[] {
    const blocks: CopyBlock[] = [];
    const seen = new Set<string>();
    let lastHeading: string | null = null;
    let heroH1 = false;

    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const next = nodes[i + 1];
        const text = norm(n.text);
        const own = norm(n.ownText);

        if (isHeading(n) && text) {
            let slot: CopySlot = n.slotHint;
            if (headingRole(n) === "h1" && slot === "main" && !heroH1) {
                slot = "hero";
                heroH1 = true;
            }
            lastHeading = text;
            push(blocks, seen, {
                role: headingRole(n),
                text,
                slot,
                selector: n.selector,
                nearbyHeading: null,
                href: n.href,
                source: "visible",
            });
            continue;
        }

        if (
            next &&
            isHeading(next) &&
            text.length >= 2 &&
            text.length <= 48 &&
            !n.isButton &&
            n.tag !== "A" &&
            n.tag !== "LABEL" &&
            !isNumericText(own || text)
        ) {
            let slot: CopySlot = n.slotHint;
            if (
                headingRole(next) === "h1" &&
                next.slotHint === "main" &&
                !heroH1
            ) {
                slot = "hero";
            }
            push(blocks, seen, {
                role: "eyebrow",
                text,
                slot,
                selector: n.selector,
                nearbyHeading: null,
                href: null,
                source: "visible",
            });
            continue;
        }

        const num = own || text;
        if (
            isNumericText(num) &&
            next &&
            isKpiLabel(next) &&
            n.slotHint !== "nav" &&
            n.slotHint !== "header"
        ) {
            push(blocks, seen, {
                role: "kpi-value",
                text: num,
                slot: n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: null,
                source: "visible",
            });
            push(blocks, seen, {
                role: "kpi-label",
                text: norm(next.text),
                slot: next.slotHint,
                selector: next.selector,
                nearbyHeading: lastHeading,
                href: null,
                source: "visible",
            });
            i += 1;
            continue;
        }

        if (n.alt && norm(n.alt)) {
            push(blocks, seen, {
                role: "alt",
                text: n.alt,
                slot: n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: n.href,
                source: "attr",
            });
            if (!text && !n.placeholder && !n.ariaLabel) continue;
        }

        if (n.placeholder && norm(n.placeholder)) {
            push(blocks, seen, {
                role: "placeholder",
                text: n.placeholder,
                slot: n.slotHint === "main" ? "form" : n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: null,
                source: "attr",
            });
        }

        if (n.tag === "LABEL" && text) {
            push(blocks, seen, {
                role: "form-label",
                text,
                slot: n.slotHint === "main" ? "form" : n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: null,
                source: "visible",
            });
            continue;
        }

        if (
            n.ariaLabel &&
            norm(n.ariaLabel) &&
            (n.tag === "INPUT" || n.tag === "TEXTAREA" || n.tag === "SELECT")
        ) {
            push(blocks, seen, {
                role: "form-label",
                text: n.ariaLabel,
                slot: n.slotHint === "main" ? "form" : n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: null,
                source: "attr",
            });
        }

        if (n.tag === "INPUT" || n.tag === "TEXTAREA" || n.tag === "SELECT") {
            continue;
        }

        if (n.slotHint === "nav" && text) {
            push(blocks, seen, {
                role: "nav",
                text,
                slot: "nav",
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: n.href,
                source: "visible",
            });
            continue;
        }

        if (
            n.tag === "A" &&
            text &&
            (n.slotHint === "header" || n.slotHint === "footer")
        ) {
            push(blocks, seen, {
                role: "nav",
                text,
                slot: n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: n.href,
                source: "visible",
            });
            continue;
        }

        if (n.isButton || n.inputType === "submit") {
            if (text) {
                push(blocks, seen, {
                    role: "cta",
                    text,
                    slot: n.slotHint,
                    selector: n.selector,
                    nearbyHeading: lastHeading,
                    href: n.href,
                    source: "visible",
                });
            }
            continue;
        }

        if (n.tag === "A" && text && text.length <= 48) {
            push(blocks, seen, {
                role: "cta",
                text,
                slot: n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: n.href,
                source: "visible",
            });
            continue;
        }

        if (text.length >= 2) {
            push(blocks, seen, {
                role: "body",
                text,
                slot: n.slotHint,
                selector: n.selector,
                nearbyHeading: lastHeading,
                href: n.href,
                source: "visible",
            });
        }
    }

    return blocks;
}
