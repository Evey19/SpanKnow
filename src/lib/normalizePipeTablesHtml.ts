function isSeparatorRow(text: string) {
  const t = text.replace(/\s+/g, "");
  if (!t.includes("|")) return false;
  return /^[|:\-]+$/.test(t.replace(/\|/g, ""));
}

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function splitRowCells(innerHtml: string) {
  const parts = innerHtml.split("|");
  if (parts.length < 3) return [];
  return parts.slice(1, -1).map((p) => p.trim());
}

function buildTable(rows: string[]) {
  const rowInners = rows
    .map((r) => r.replace(/^<p>\s*/i, "").replace(/\s*<\/p>$/i, ""))
    .filter((r) => r.trim().startsWith("|"));

  if (rowInners.length < 2) return null;

  const plainRows = rowInners.map((r) =>
    stripTags(r)
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  );

  const hasHeader = rowInners.length >= 2 && isSeparatorRow(plainRows[1]);

  const headerCells = hasHeader ? splitRowCells(rowInners[0]) : [];
  const bodyRows = hasHeader ? rowInners.slice(2) : rowInners;

  const bodyCells = bodyRows
    .map((r) => splitRowCells(r))
    .filter((cells) => cells.length > 0);

  if (hasHeader && headerCells.length === 0) return null;
  if (bodyCells.length === 0) return null;

  const th = (c: string) =>
    `<th class="border border-border bg-muted px-2 py-1 text-left font-semibold">${c}</th>`;
  const td = (c: string) =>
    `<td class="border border-border px-2 py-1 align-top">${c}</td>`;

  const thead = hasHeader
    ? `<thead><tr>${headerCells.map(th).join("")}</tr></thead>`
    : "";
  const tbody = `<tbody>${bodyCells
    .map((cells) => `<tr>${cells.map(td).join("")}</tr>`)
    .join("")}</tbody>`;

  return `<div class="my-2 overflow-x-auto"><table class="w-full border-separate border-spacing-0 text-sm">${thead}${tbody}</table></div>`;
}

export function normalizePipeTablesHtml(html: string) {
  return html.replace(/(?:<p>\s*\|[\s\S]*?\|\s*<\/p>\s*){2,}/gi, (block) => {
    const rows = block.match(/<p>[\s\S]*?<\/p>/gi) ?? [];
    const table = buildTable(rows);
    return table ?? block;
  });
}

