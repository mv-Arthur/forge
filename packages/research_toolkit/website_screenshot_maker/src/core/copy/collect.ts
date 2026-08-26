import type { Page } from "playwright";
import type { CopySlot } from "./types.js";

const SLOT_HINTS: CopySlot[] = [
    "header",
    "nav",
    "main",
    "form",
    "footer",
    "dialog",
    "tabs",
    "gallery",
];

export type RawCopyNode = {
    tag: string;
    text: string;
    ownText: string;
    href: string | null;
    placeholder: string | null;
    alt: string | null;
    ariaLabel: string | null;
    selector: string;
    slotHint: CopySlot;
    fontSize: number;
    isButton: boolean;
    inputType: string;
    y: number;
};

function asSlot(raw: string): CopySlot {
    return SLOT_HINTS.includes(raw as CopySlot) ? (raw as CopySlot) : "main";
}

const COLLECT_SRC = `
const skipTags = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SVG: 1, PATH: 1 };
function visible(el) {
    if (el.closest("[hidden], [aria-hidden=true]")) return false;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") return false;
    if (st.opacity === "0") return false;
    const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1;
}
function ownText(el) {
    var s = "";
    var nodes = el.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 3) s += nodes[i].textContent || "";
    }
    return s.replace(/\\s+/g, " ").trim();
}
function isNumeric(s) {
    var t = s.replace(/\\s/g, "");
    return /^\\d+([.,]\\d+)?%?$/.test(t);
}
function slotHint(el) {
    if (el.closest("nav")) return "nav";
    if (el.closest("form")) return "form";
    if (el.closest("[role=dialog]")) return "dialog";
    if (el.closest("[role=tablist]")) return "tabs";
    try {
        if (el.closest('[class*="gallery"], [data-gallery]')) return "gallery";
    } catch (e) {}
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    return "main";
}
var sel = "h1,h2,h3,p,button,[role=button],[type=submit],a,label,input:not([type=hidden]),textarea,select,img[alt],[role=tab]";
var set = [];
function hasEl(el) {
    for (var i = 0; i < set.length; i++) if (set[i] === el) return true;
    return false;
}
function addEl(el) {
    if (!hasEl(el)) set.push(el);
}
var found = document.querySelectorAll(sel);
for (var i = 0; i < found.length; i++) {
    var el = found[i];
    if (skipTags[el.tagName]) continue;
    if (!visible(el)) continue;
    if (el.closest("h1, h2, h3") && !/^H[123]$/.test(el.tagName)) continue;
    if (el.tagName === "P" && el.closest("a, button, label, h1, h2, h3")) continue;
    if (el.tagName === "A" && el.closest("button")) continue;
    addEl(el);
}
var extras = document.querySelectorAll("div, span, strong, b, dt, dd");
for (var j = 0; j < extras.length; j++) {
    var ex = extras[j];
    if (hasEl(ex) || !visible(ex)) continue;
    var own = ownText(ex);
    if (!isNumeric(own) || own.length > 16) continue;
    addEl(ex);
    var sib = ex.nextElementSibling;
    if (sib && visible(sib) && !hasEl(sib)) {
        var t = (sib.innerText || "").trim();
        if (t.length >= 2 && t.length <= 48) addEl(sib);
    }
}
set.sort(function (a, b) {
    var p = a.compareDocumentPosition(b);
    if (p & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (p & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
});
var out = [];
var n = 0;
for (var k = 0; k < set.length; k++) {
    if (n >= 250) break;
    var node = set[k];
    var text = (node.innerText || "").replace(/\\s+/g, " ").trim();
    var own2 = ownText(node);
    var placeholder = node.getAttribute("placeholder");
    var alt = node.getAttribute("alt");
    var ariaLabel = node.getAttribute("aria-label");
    if (text.length < 2 && own2.length < 1 && !placeholder && !alt && !ariaLabel) continue;
    var idx = n++;
    node.setAttribute("data-wsm-copy", String(idx));
    var href = null;
    if (node.getAttribute("href") && node.tagName === "A") href = node.href;
    var role = node.getAttribute("role") || "";
    var inputType = (node.getAttribute("type") || "").toLowerCase();
    var cls = (node.className || "").toString().toLowerCase();
    var isButton = node.tagName === "BUTTON" || inputType === "submit" || role === "button" || cls.indexOf("btn") !== -1 || cls.indexOf("button") !== -1;
    var r = node.getBoundingClientRect();
    out.push({
        tag: node.tagName,
        text: text,
        ownText: own2,
        href: href,
        placeholder: placeholder,
        alt: alt,
        ariaLabel: ariaLabel,
        selector: '[data-wsm-copy="' + idx + '"]',
        slotHint: slotHint(node),
        fontSize: parseFloat(window.getComputedStyle(node).fontSize) || 0,
        isButton: isButton,
        inputType: inputType,
        y: r.y
    });
}
return out;
`;

/** Visible copy candidates with data-wsm-copy selectors. */
export async function collectCopyNodes(page: Page): Promise<RawCopyNode[]> {
    const raw = (await page.evaluate(
        new Function(COLLECT_SRC) as () => Array<
            Omit<RawCopyNode, "slotHint"> & { slotHint: string }
        >,
    )) as Array<Omit<RawCopyNode, "slotHint"> & { slotHint: string }>;

    return raw.map((n) => ({
        ...n,
        slotHint: asSlot(n.slotHint),
    }));
}
