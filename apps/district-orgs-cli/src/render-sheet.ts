import {
    numberedGroups,
    placeGroupsAroundMap,
} from "@forge/district-orgs";
import type {
    District,
    DistrictSheet,
    NumberedGroup,
} from "@forge/district-orgs";

export {
    markersForGroups,
    numberedGroups,
    placeGroupsAroundMap,
} from "@forge/district-orgs";
export type { AroundSides, NumberedGroup } from "@forge/district-orgs";

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
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110mm minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-areas:
    "w n e"
    "w map e"
    "w s e";
  gap: 2.2mm 3mm;
}
.cell-n { grid-area: n; align-content: end; justify-content: center; }
.cell-s { grid-area: s; align-content: start; justify-content: center; }
.cell-w { grid-area: w; }
.cell-e { grid-area: e; }
.cell-map {
  grid-area: map;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.cell-w,
.cell-e {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cell-n,
.cell-s {
  display: flex;
  flex-wrap: wrap;
  gap: 1.6mm 3mm;
}
.cell-n .group,
.cell-s .group {
  flex: 1 1 40mm;
  min-width: 36mm;
}
.group { margin-bottom: 1.4mm; }
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
  width: 110mm;
  aspect-ratio: 650 / 450;
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
    const sides = placeGroupsAroundMap(numberedGroups(params.sheet.groups));
    return `<section class="sheet">
  <div class="hdr">
    <span>${esc(params.district.title)}</span>
    <span>лист ${params.sheet.index}/${params.sheetCount} · ${params.sheet.organizations.length} орг.</span>
  </div>
  <div class="body">
    <div class="cell cell-n">${renderGroups(sides.top)}</div>
    <div class="cell cell-w">${renderGroups(sides.left)}</div>
    <div class="cell cell-map">
      <div class="map-wrap">
        ${params.mapDataUri ? `<img src="${params.mapDataUri}" alt="кроп района">` : ""}
      </div>
    </div>
    <div class="cell cell-e">${renderGroups(sides.right)}</div>
    <div class="cell cell-s">${renderGroups(sides.bottom)}</div>
  </div>
</section>`;
}

function renderGroups(items: NumberedGroup[]): string {
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
