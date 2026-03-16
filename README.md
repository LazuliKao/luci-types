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
