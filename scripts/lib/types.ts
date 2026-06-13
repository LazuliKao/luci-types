/**
 * Shared types for the LuCI type declaration validator.
 */

export type DocSection =
	| "member"
	| "method"
	| "type-def"
	| "class"
	| "namespace";

export interface DocItem {
	name: string;
	rawName: string;
	section: DocSection;
}

export interface DocPage {
	html: string;
	items: DocItem[];
}

export interface ComparisonResult {
	missing: string[];
	extra: string[];
}
