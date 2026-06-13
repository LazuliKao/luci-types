#!/usr/bin/env tsx
/**
 * Validates that the TypeScript declarations in luci.d.ts and luci/*.d.ts
 * match the documented LuCI API from https://openwrt.github.io/luci/jsapi/
 *
 * Checks:
 *   - Top-level L type members vs Members + Methods sections
 *   - LuCI namespace type aliases vs Type Definitions section
 *   - Class/Namespace sub-module declarations vs Classes + Namespaces sections
 *   - Subpage members for each sub-module vs the corresponding
 *     `declare namespace LuCI.*` declarations
 *
 * Usage: tsx scripts/validate-api.ts
 */

import {
	fetchDocPage,
	fetchSubPageItems,
	extractDocSection,
} from "./lib/doc.js";
import {
	parseLTypeMembers,
	parseNamespaceTypeDefs,
	parseNamespaceMembers,
	parseLuciSubModules,
	parseChildMembers,
} from "./lib/ts.js";
import type { DocItem } from "./lib/types.js";

function printMissing(
	label: string,
	items: string[],
	docItems: DocItem[],
	html: string,
): number {
	if (items.length === 0) {
		console.log("%s — none.\n", label);
		return 0;
	}
	console.log("%s (%d):", label, items.length);
	for (const name of items) {
		const item = docItems.find((d) => d.name === name);
		const doc = item ? extractDocSection(html, item) : "";
		console.log("\n  - %s", name);
		if (doc) console.log("    %s", doc);
	}
	console.log();
	return 1;
}

function printExtra(label: string, items: string[]): void {
	if (items.length === 0) return;
	console.log("%s (%d):", label, items.length);
	for (const name of items) console.log("   - %s", name);
	console.log();
}

async function main(): Promise<void> {
	let exitCode = 0;

	// ---- Main page ----
	const { html, items: docItems } = await fetchDocPage();
	const docMembers = docItems
		.filter((d) => d.section === "member")
		.map((d) => d.name);
	const docMethods = docItems
		.filter((d) => d.section === "method")
		.map((d) => d.name);
	const docTypeDefs = docItems
		.filter((d) => d.section === "type-def")
		.map((d) => d.name);
	const docClasses = docItems
		.filter((d) => d.section === "class")
		.map((d) => d.name);
	const docNamespaces = docItems
		.filter((d) => d.section === "namespace")
		.map((d) => d.name);

	const docModules = [...new Set([...docClasses, ...docNamespaces])].sort();

	// ---- 1. L type members / methods ----
	const lMemberNames = parseLTypeMembers();
	const docLSet = new Set([...docMembers, ...docMethods]);
	const lSet = new Set(lMemberNames);

	const missingL = [...docLSet].filter((n) => !lSet.has(n)).sort();
	const extraL = lMemberNames.filter((n) => !docLSet.has(n)).sort();

	exitCode += printMissing(
		"Documented but MISSING from L type",
		missingL,
		docItems,
		html,
	);
	printExtra("Present in L type but NOT documented", extraL);

	// ---- 2. LuCI namespace type definitions ----
	const nsDefs = parseNamespaceTypeDefs();
	const nsSet = new Set(nsDefs);
	const docTypeSet = new Set(docTypeDefs);

	const missingTypes = [...docTypeSet].filter((n) => !nsSet.has(n));
	const extraTypes = nsDefs.filter((n) => !docTypeSet.has(n));

	exitCode += printMissing(
		"Documented type definitions MISSING from LuCI namespace",
		missingTypes,
		docItems,
		html,
	);
	printExtra(
		"Present in LuCI namespace but NOT documented as type defs",
		extraTypes,
	);

	// ---- 3. Classes / Namespaces ----
	const declaredModules = parseLuciSubModules();
	const moduleSet = new Set(declaredModules);
	const docModuleSet = new Set(docModules);

	const missingModules = [...docModuleSet]
		.filter((n) => !moduleSet.has(n))
		.sort();
	const extraModules = declaredModules
		.filter((n) => !docModuleSet.has(n))
		.sort();

	exitCode += printMissing(
		"Documented classes/namespaces MISSING from type declarations",
		missingModules,
		docItems,
		html,
	);
	printExtra(
		"Declared in LuCI namespace but NOT documented as class/namespace",
		extraModules,
	);
	// ---- 4. Subpage validation ----
	for (const mod of declaredModules) {
		console.log("--- Validating subpage: %s ---\n", mod);

		// Fetch with subpage=false so classes/namespaces are also extracted
		let subPage: { html: string; items: DocItem[] };
		try {
			subPage = await fetchSubPageItems(mod, false);
		} catch {
			console.log("  (no doc page found, skipping)\n");
			continue;
		}
		const { html: subHtml, items: subItems } = subPage;

		// --- Top-level members vs doc members/methods/type-defs ---
		const subMembers = subItems
			.filter((d) => d.section === "member")
			.map((d) => d.name);
		const subMethods = subItems
			.filter((d) => d.section === "method")
			.map((d) => d.name);
		const subTypeDefs = subItems
			.filter((d) => d.section === "type-def")
			.map((d) => d.name);
		const subDocSet = new Set([...subMembers, ...subMethods, ...subTypeDefs]);

		const subDeclared = parseNamespaceMembers(mod);
		const subDeclaredSet = new Set(subDeclared);

		const missingSub = [...subDocSet]
			.filter((n) => !subDeclaredSet.has(n))
			.sort();
		const extraSub = subDeclared.filter((n) => !subDocSet.has(n)).sort();

		exitCode += printMissing(
			`Documented ${mod} members MISSING from LuCI.${mod} declarations`,
			missingSub,
			subItems,
			subHtml,
		);
		printExtra(`Declared in LuCI.${mod} but NOT documented`, extraSub);

		// --- Recursively validate child classes/namespaces ---
		const docChildren = subItems
			.filter((d) => d.section === "class" || d.section === "namespace")
			.map((d) => d.name);
		const uniqueChildren = [...new Set(docChildren)];

		for (const child of uniqueChildren) {
			let childPage: { html: string; items: DocItem[] };
			try {
				childPage = await fetchSubPageItems(`${mod}.${child}`);
			} catch {
				continue;
			}
			console.log("--- Validating subpage: %s.%s ---\n", mod, child);

			const childMembers = childPage.items
				.filter((d) => d.section === "member")
				.map((d) => d.name);
			const childMethods = childPage.items
				.filter((d) => d.section === "method")
				.map((d) => d.name);
			const childTypeDefs = childPage.items
				.filter((d) => d.section === "type-def")
				.map((d) => d.name);
			const childDocSet = new Set([
				...childMembers,
				...childMethods,
				...childTypeDefs,
			]);

			const childDeclared = parseChildMembers(mod, child);
			const childDeclaredSet = new Set(childDeclared);

			const missingChild = [...childDocSet]
				.filter((n) => !childDeclaredSet.has(n))
				.sort();
			const extraChild = childDeclared
				.filter((n) => !childDocSet.has(n))
				.sort();

			exitCode += printMissing(
				`Documented ${mod}.${child} members MISSING from LuCI.${mod}.${child} declarations`,
				missingChild,
				childPage.items,
				childPage.html,
			);
			printExtra(
				`Declared in LuCI.${mod}.${child} but NOT documented`,
				extraChild,
			);
		}
	}

	// ---- Summary ----
	if (exitCode === 0) {
		console.log("Everything matches.");
	}
	process.exit(exitCode);
}

main().catch((err: unknown) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
