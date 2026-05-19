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
