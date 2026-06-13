/**
 * Documentation page fetching and parsing for LuCI JS API validation.
 */

import type { DocItem, DocSection, DocPage } from "./types.js";

const DOCS_URL = "https://openwrt.github.io/luci/jsapi/LuCI.html";

const SUBPAGE_BASE = "https://openwrt.github.io/luci/jsapi/LuCI.";

const SECTION_RECORD: Record<string, DocSection> = {
	members: "member",
	methods: "method",
	"type-definitions": "type-def",
	classes: "class",
	namespaces: "namespace",
};

/**
 * Fetch and parse the main LuCI documentation page.
 * Returns both the raw HTML and the extracted items.
 */
export async function fetchDocPage(): Promise<DocPage> {
	const res = await fetch(DOCS_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch docs: ${res.status} ${res.statusText}`);
	}
	const html = await res.text();
	const items = parseDocHtml(html);
	return { html, items };
}

/**
 * Fetch and parse a class subpage (e.g. LuCI.baseclass.html).
 * Subpages contain members/methods/type-defs only (no classes/namespaces).
 */
export async function fetchSubPageItems(
	className: string,
	subpage = true,
): Promise<DocPage> {
	const url = `${SUBPAGE_BASE}${className}.html`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch subpage ${url}: ${res.status} ${res.statusText}`,
		);
	}
	const html = await res.text();
	const items = parseDocHtml(html, subpage);
	return { html, items };
}

/**
 * Parse h2-sectioned JSDoc HTML into items.
 * When `subpage` is true, only members/methods/type-defs are extracted
 * (class/namespace sections don't appear on subpages).
 */
function parseDocHtml(html: string, subpage = false): DocItem[] {
	const items: DocItem[] = [];
	let searchPos = 0;

	while (searchPos < html.length) {
		const h2Start = html.indexOf("<h2", searchPos);
		if (h2Start < 0) break;

		const idMatch = html.slice(h2Start, h2Start + 120).match(/id="([^"]+)"/);
		if (idMatch === null) {
			searchPos = h2Start + 4;
			continue;
		}
		const h2Id = idMatch[1];
		const sectionKind = SECTION_RECORD[h2Id];

		const nextH2 = html.indexOf("<h2", h2Start + 4);
		const sectionEnd = nextH2 >= 0 ? nextH2 : html.length;
		const sectionHtml = html.slice(h2Start, sectionEnd);

		if (sectionKind !== undefined) {
			if (sectionKind === "class" || sectionKind === "namespace") {
				if (!subpage) {
					// Classes and Namespaces use <a href="LuCI.xxx.html">xxx</a> links
					const linkRegex = /<a href="LuCI\.([^"]+)\.html"[^>]*>([^<]+)<\/a>/g;
					let linkMatch: RegExpExecArray | null;
					while ((linkMatch = linkRegex.exec(sectionHtml)) !== null) {
						const rawName = linkMatch[1];
						const name = linkMatch[2];
						if (rawName === undefined || name === undefined) continue;
						items.push({ name, rawName, section: sectionKind });
					}
				}
			} else {
				// Members, Methods, Type Definitions use <h3 id="xxx"> elements
				const h3Regex = /<h3[^>]*id="([^"]+)"[^>]*>/g;
				let h3Match: RegExpExecArray | null;
				while ((h3Match = h3Regex.exec(sectionHtml)) !== null) {
					const rawName = h3Match[1];
					if (rawName === undefined || rawName === h2Id) continue;

					// Strip leading dot/tilde (e.g. `.requestCallbackFn` → `requestCallbackFn`, `~ignoreCallbackFn` → `ignoreCallbackFn`)
					const name = rawName.replace(/^[.~]/, "");
					items.push({ name, rawName, section: sectionKind });
				}
			}
		}

		searchPos = sectionEnd;
	}

	return items;
}

/**
 * Extract the descriptive section text for a documented item from the HTML.
 */
export function extractDocSection(html: string, item: DocItem): string {
	const searchStr =
		item.section === "class" || item.section === "namespace"
			? `LuCI.${item.rawName}.html`
			: `<h3 id="${item.rawName}"`;
	const nodeStart = html.indexOf(searchStr);
	if (nodeStart < 0) return "";

	const nextH3 = html.indexOf("<h3", nodeStart + 4);
	const nextH2 = html.indexOf("<h2", nodeStart + 4);
	const sectionEnd = Math.min(
		nextH3 >= 0 ? nextH3 : html.length,
		nextH2 >= 0 ? nextH2 : html.length,
	);

	const raw = html.slice(nodeStart, sectionEnd);
	return raw
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
