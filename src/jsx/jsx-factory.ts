/**
 * JSX Fragment symbol
 */
export const Fragment = Symbol.for("jsx.fragment");

type NormalizedChild = Node | string;

function normalizeChildren(
	input: unknown[],
	out: NormalizedChild[] = [],
): NormalizedChild[] {
	for (const child of input) {
		if (child == null || typeof child === "boolean") continue;

		if (Array.isArray(child)) {
			normalizeChildren(child, out);
		} else {
			out.push(child instanceof Node ? child : String(child));
		}
	}
	return out;
}

function isPropertyBag(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isEventListener(value: unknown): value is EventListener {
	return typeof value === "function";
}

function createJsxNode(type: unknown, config: unknown): Node {
	const { children, ...props } = isPropertyBag(config) ? config : {};

	const childArray =
		children == null ? [] : Array.isArray(children) ? children : [children];
	const filteredChildren = normalizeChildren(childArray);

	if (type === Fragment) {
		const fragment = document.createDocumentFragment();
		fragment.append(...filteredChildren);
		return fragment;
	}

	if (typeof type === "function") {
		const result: unknown = Reflect.apply(type, undefined, [
			{ ...props, children: filteredChildren },
		]);
		if (!(result instanceof Node)) {
			throw new TypeError("JSX components must return a DOM Node");
		}
		return result;
	}

	if (typeof type !== "string") {
		throw new TypeError(
			"JSX element types must be tag names or component functions",
		);
	}

	const eventHandlers: Record<string, EventListener> = {};
	const finalProps = { ...props };

	for (const [key, value] of Object.entries(finalProps)) {
		if (key.startsWith("on") && isEventListener(value)) {
			eventHandlers[key] = value;
			delete finalProps[key];
		} else if (typeof value === "boolean") {
			if (value) {
				finalProps[key] = key;
			} else {
				delete finalProps[key];
			}
		}
	}

	const hasProps = Object.keys(finalProps).length > 0;
	const element = !hasProps
		? filteredChildren.length > 1
			? E(type, {}, filteredChildren)
			: E(type, {}, filteredChildren[0])
		: filteredChildren.length > 1
			? E(type, finalProps, filteredChildren)
			: E(type, finalProps, filteredChildren[0]);

	for (const [eventName, handler] of Object.entries(eventHandlers)) {
		const eventType = eventName.slice(2).toLowerCase();
		(element as HTMLElement).addEventListener(eventType, handler);
	}

	return element;
}

/**
 * JSX automatic runtime - production (single/no children)
 */
export function jsx(type: unknown, config: unknown): Node {
	return createJsxNode(type, config);
}

/**
 * JSX automatic runtime - production (multiple static children)
 */
export function jsxs(type: unknown, config: unknown): Node {
	return createJsxNode(type, config);
}

/**
 * JSX automatic runtime - development mode
 */
export function jsxDEV(type: unknown, config: unknown): Node {
	return createJsxNode(type, config);
}
