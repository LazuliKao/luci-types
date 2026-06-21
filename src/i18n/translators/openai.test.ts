import assert from "node:assert/strict";
import test from "node:test";
import { OpenAICompatibleTranslator } from "./openai.ts";

function createChatResponse(content: string): Response {
	return new Response(
		JSON.stringify({
			choices: [{ message: { content } }],
		}),
		{
			status: 200,
			headers: { "content-type": "application/json" },
		},
	);
}

function getSourceLine(body: unknown): string {
	assert.ok(typeof body === "object" && body !== null);

	const requestBody = body as {
		messages?: Array<{ role: string; content: string }>;
	};
	assert.ok(Array.isArray(requestBody.messages));
	const messages = requestBody.messages;

	const prompt = messages.findLast((message) => message.role === "user")?.content;
	assert.ok(typeof prompt === "string");

	const sourceLine = prompt.split("\n").find((line) => line.startsWith("__"));
	assert.ok(typeof sourceLine === "string");
	return sourceLine;
}

function getLabel(sourceLine: string): string {
	const match = /^(__\d+_[0-9a-f]+__)/u.exec(sourceLine);
	assert.ok(match !== null);
	return match[1];
}

test("retry keeps prior invalid translation alongside source lines", async () => {
	const source = "Reboot %s to apply changes.";
	const invalidTarget = "重启 以应用更改。";
	const validTarget = "重启 %s 以应用更改。";
	let callCount = 0;

	const originalFetch = globalThis.fetch;
	Object.defineProperty(globalThis, "fetch", {
		configurable: true,
		value: async (_input: RequestInfo | URL, init?: RequestInit) => {
			callCount += 1;
			const body = JSON.parse(String(init?.body));
			const sourceLine = getSourceLine(body);
			const label = getLabel(sourceLine);

			if (callCount === 1) {
				return createChatResponse(`${label}. ${JSON.stringify(invalidTarget)}`);
			}

			assert.equal(callCount, 2);
			assert.equal(body.messages[3]?.role, "assistant");
			assert.equal(body.messages[3]?.content, `${label}. ${JSON.stringify(invalidTarget)}`);
			assert.match(
				body.messages[4]?.content,
				/Do not translate, explain, or answer the validator feedback itself\./u,
			);
			assert.match(body.messages[4]?.content, /Expected tokens \["%s"\]/u);
			assert.match(body.messages[4]?.content, /Reboot %s to apply changes\./u);
			assert.match(body.messages[4]?.content, /__01_[0-9a-f]+__\. /u);

			return createChatResponse(`${label}. ${JSON.stringify(validTarget)}`);
		},
		writable: true,
	});

	try {
		const translator = new OpenAICompatibleTranslator({ apiKey: "test-key" });
		const translated = await translator.translate([source]);
		assert.equal(translated.get(source), validTarget);
		assert.equal(callCount, 2);
	} finally {
		Object.defineProperty(globalThis, "fetch", {
			configurable: true,
			value: originalFetch,
			writable: true,
		});
	}
});

test("retry also keeps malformed previous response", async () => {
	const source = "Animation";
	const malformedResponse = "无效。请修复并返回完整响应。";
	const validTarget = "动画";
	let callCount = 0;

	const originalFetch = globalThis.fetch;
	Object.defineProperty(globalThis, "fetch", {
		configurable: true,
		value: async (_input: RequestInfo | URL, init?: RequestInit) => {
			callCount += 1;
			const body = JSON.parse(String(init?.body));
			const sourceLine = getSourceLine(body);
			const label = getLabel(sourceLine);

			if (callCount === 1) {
				return createChatResponse(malformedResponse);
			}

			assert.equal(callCount, 2);
			assert.equal(body.messages[3]?.role, "assistant");
			assert.equal(body.messages[3]?.content, malformedResponse);
			assert.match(
				body.messages[4]?.content,
				/Translator response must be hashline output/u,
			);
			assert.match(body.messages[4]?.content, /__01_[0-9a-f]+__\. "Animation"/u);

			return createChatResponse(`${label}. ${JSON.stringify(validTarget)}`);
		},
		writable: true,
	});

	try {
		const translator = new OpenAICompatibleTranslator({ apiKey: "test-key" });
		const translated = await translator.translate([source]);
		assert.equal(translated.get(source), validTarget);
		assert.equal(callCount, 2);
	} finally {
		Object.defineProperty(globalThis, "fetch", {
			configurable: true,
			value: originalFetch,
			writable: true,
		});
	}
});
