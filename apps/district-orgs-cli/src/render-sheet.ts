import type {
    AddressGroup,
    District,
    DistrictSheet,
} from "@forge/district-orgs";
import type { MapMarker } from "./static-map.ts";

export function renderSheetsHtml(params: {
    district: District;
    sheets: DistrictSheet[];
    maps: string[];
    query: string;
}): string {
    const sheets = params.sheets
        .map((sheet, i) =>
            renderSheet({
                district: params.district,
                sheet,
                mapDataUri: params.maps[i] ?? "",
                sheetCount: params.sheets.length,
            })
        )
        .join("\n");
    return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>${esc(params.district.title)} — листы обхода</title>
<style>
@page { size: A4 portrait; margin: 6mm; }
html, body { margin: 0; padding: 0; }
body { font: 7.5pt/1.15 "Helvetica Neue", Arial, sans-serif; color: #111; }
.sheet {
  width: 198mm;
  height: 285mm;
  overflow: hidden;
  break-after: page;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.sheet:last-child { break-after: auto; page-break-after: auto; }
.hdr {
  display: flex;
  justify-content: space-between;
  font-size: 8.5pt;
  font-weight: 700;
  margin-bottom: 2mm;
  border-bottom: 0.4pt solid #222;
  padding-bottom: 1mm;
}
.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3mm;
  min-height: 0;
}
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4mm;
  flex: 1;
  min-height: 0;
}
.col { overflow: visible; }
.group { margin-bottom: 1.6mm; }
.group-title { font-weight: 700; font-size: 7pt; }
.group-title .n {
  display: inline-block;
  min-width: 1.4em;
  color: #c00;
}
ol.names { margin: 0.2mm 0 0 0; padding-left: 0; list-style: none; }
ol.names li { display: flex; gap: 0.4em; }
.idx { min-width: 2.2em; flex: 0 0 auto; }
.map-wrap {
  width: 100%;
  aspect-ratio: 650 / 450;
  align-self: start;
}
.map-wrap img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
</head>
<body>
${sheets}
</body>
</html>
`;
}

function renderSheet(params: {
    district: District;
    sheet: DistrictSheet;
    mapDataUri: string;
    sheetCount: number;
}): string {
    const numbered = numberedGroups(params.sheet.groups);
    const [left, right] = packColumns(numbered);
    return `<section class="sheet">
  <div class="hdr">
    <span>${esc(params.district.title)}</span>
    <span>лист ${params.sheet.index}/${params.sheetCount} · ${params.sheet.organizations.length} орг.</span>
  </div>
  <div class="body">
    <div class="map-wrap">
      ${params.mapDataUri ? `<img src="${params.mapDataUri}" alt="кроп района">` : ""}
    </div>
    <div class="cols">
      <div class="col">${renderGroups(left)}</div>
      <div class="col">${renderGroups(right)}</div>
    </div>
  </div>
</section>`;
}

export function numberedGroups(
    groups: AddressGroup[]
): Array<{ group: AddressGroup; start: number; index: number }> {
    return numberGroups(sortGroups(groups));
}

export function markersForGroups(groups: AddressGroup[]): MapMarker[] {
    return numberedGroups(groups)
        .filter(
            (item) =>
                item.group.coordinates.lon !== 0 ||
                item.group.coordinates.lat !== 0
        )
        .map((item) => ({
            lon: item.group.coordinates.lon,
            lat: item.group.coordinates.lat,
            label: item.index,
        }));
}

function sortGroups(groups: AddressGroup[]): AddressGroup[] {
    return [...groups].sort((a, b) => {
        const lat = b.coordinates.lat - a.coordinates.lat;
        if (lat !== 0) return lat;
        return a.coordinates.lon - b.coordinates.lon;
    });
}

function numberGroups(
    groups: AddressGroup[]
): Array<{ group: AddressGroup; start: number; index: number }> {
    let nameIndex = 1;
    return groups.map((group, i) => {
        const start = nameIndex;
        nameIndex += group.organizations.length;
        return { group, start, index: i + 1 };
    });
}

function packColumns(
    items: Array<{ group: AddressGroup; start: number; index: number }>
): [
    Array<{ group: AddressGroup; start: number; index: number }>,
    Array<{ group: AddressGroup; start: number; index: number }>,
] {
    const left: typeof items = [];
    const right: typeof items = [];
    let leftCount = 0;
    let rightCount = 0;
    for (const item of items) {
        const n = item.group.organizations.length;
        if (leftCount <= rightCount) {
            left.push(item);
            leftCount += n;
        } else {
            right.push(item);
            rightCount += n;
        }
    }
    return [left, right];
}

function renderGroups(
    items: Array<{ group: AddressGroup; start: number; index: number }>
): string {
    return items
        .map((item) => {
            const names = item.group.organizations
                .map(
                    (org, j) =>
                        `<li><span class="idx">${item.start + j}.</span> ${esc(org.title)}</li>`
                )
                .join("");
            return `<div class="group">
  <div class="group-title"><span class="n">${item.index}</span> ${esc(item.group.address)}</div>
  <ol class="names">${names}</ol>
</div>`;
        })
        .join("");
}

function esc(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
