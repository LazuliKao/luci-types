# @lazulikao/luci-types

TypeScript type definitions for the [LuCI](https://openwrt.org/docs/guide-developer/luci/start) OpenWrt web framework.

## Install

```bash
pnpm add -D @lazulikao/luci-types
```

## Contents

- `LuCI` namespace — `uci`, `View`, `FS`, `Form`, `UI`, `RPC`, `UCI`, `POLL`
- Global declarations — `L`, `E`, `_` (i18n), `widgets`, `fwmodel`
- `LuCI.form` — `CBIMap`, `CBIAbstractSection`, `CBIAbstractValue`, `CBIValue`, ...
- JSX ambient declarations for a custom DOM JSX factory (`createJsxElement`)

## Usage

Reference the package in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@lazulikao/luci-types"]
  }
}
```

Or use a triple-slash reference in a `.d.ts` file:

```ts
/// <reference types="@lazulikao/luci-types" />
```

## Translation export CLI

This package contains TypeScript source for exporting LuCI `_()` strings from JavaScript or TypeScript source into JSON and gettext `.po` files. The source is kept as TypeScript and is not compiled into `dist/`; the published command calls `tsx` to run the TypeScript source.

```bash
pnpm exec luci-types -i ./htdocs -o ./translations.json
pnpm exec luci-types -i ./frontend-src/src --po ./po/zh_Hans/app.po --merge -p luci-app-example
```

To also call an OpenAI-compatible model and fill `.po` `msgstr` values, enable `--translate` together with `--po`. The translator uses Node's built-in `fetch`, so there is no extra OpenAI SDK dependency.

```bash
OPENAI_API_KEY=sk-... pnpm exec luci-types \
  -i ./htdocs \
  --po ./po/zh_Hans/app.po \
  --translate \
  --cache ./translation.cache.json \
  -p luci-app-example
```

For OpenAI-compatible local or third-party endpoints, set `OPENAI_API_URL` or pass `--api-url`:

```bash
OPENAI_API_KEY=local OPENAI_API_URL=http://127.0.0.1:11434/v1 OPENAI_MODEL=translategemma:12b-it-q8_0 pnpm exec luci-types \
  -i ./htdocs \
  --po ./po/zh_Hans/app.po \
  --translate
```

If you want to run `pnpm luci-types`, add a script in your app:

```json
{
  "scripts": {
    "luci-types": "luci-types -i ./frontend-src/src --po ./po/zh_Hans/app.po --merge -p luci-app-example"
  }
}
```

Then run:

```bash
pnpm luci-types
```

Options:

- `--input, -i` — source file or directory; repeat it for multiple inputs
- `--output, -o` — write extracted strings to `translations.json`
- `--po` — write a gettext `.po` file
- `--merge, -m` — preserve existing `msgstr` values in an existing `.po` file
- `--locale, -l` — locale used in `.po` headers, default `zh_Hans`
- `--package, -p` — project/package name used in `.po` metadata
- `--translate` — use a translator backend to populate `.po` `msgstr` values
- `--translator` — translator backend, currently `openai`
- `--cache` — JSON cache file mapping source strings to translated strings, default `translation.cache.json`
- `--batch-size` — strings per model request, default `25`
- `--api-url` — OpenAI-compatible base URL or chat completions endpoint, default `OPENAI_API_URL` or OpenAI
- `--prompt` — extra system prompt markdown/text file for project terminology

Environment variables used by the OpenAI-compatible translator:

- `OPENAI_API_KEY` — required API key; use any non-empty value for local endpoints that do not check it
- `OPENAI_API_URL` — optional OpenAI-compatible base URL or `/chat/completions` endpoint
- `OPENAI_MODEL` — optional model name, default `gpt-4o-mini`

Programmatic API:

```ts
import { exportTranslations } from "@lazulikao/luci-types/i18n";

await exportTranslations({
  input: "./htdocs",
  po: "./po/zh_Hans/app.po",
  packageName: "luci-app-example",
  merge: true,
});
```

Programmatic translation API:

```ts
import { OpenAICompatibleTranslator, exportTranslations } from "@lazulikao/luci-types/i18n";

await exportTranslations({
  input: "./htdocs",
  po: "./po/zh_Hans/app.po",
  packageName: "luci-app-example",
  translator: new OpenAICompatibleTranslator({
    model: "gpt-4o-mini",
    locale: "zh_Hans",
  }),
  cachePath: "./translation.cache.json",
});
```
