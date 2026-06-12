/**
 * TypeScript declaration parsing for LuCI types.
 * Uses the TypeScript compiler API to extract member names from .d.ts files.
 */

import * as ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LUCI_DIR = resolve(__dirname, "..", "..", "luci");
const LUCI_DTS = resolve(__dirname, "..", "..", "luci.d.ts");

// ---- L type literal ----

/**
 * Parse luci.d.ts and extract all member names from the `L` type literal
 * (properties and methods like `env`, `request`, `bind`, etc.).
 */
export function parseLTypeMembers(dtsPath?: string): string[] {
  const path = dtsPath ?? LUCI_DTS;
  const sourceText = readFileSync(path, "utf-8");
  const sf = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const members: string[] = [];

  function visit(node: ts.Node): void {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === "L" &&
          decl.type !== undefined &&
          ts.isTypeLiteralNode(decl.type)
        ) {
          for (const member of decl.type.members) {
            if (
              ts.isPropertySignature(member) ||
              ts.isMethodSignature(member)
            ) {
              const nameNode = member.name;
              if (nameNode !== undefined) {
                if (ts.isIdentifier(nameNode)) {
                  members.push(nameNode.text);
                } else if (ts.isStringLiteralLike(nameNode)) {
                  members.push(nameNode.text);
                }
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return members;
}

// ---- LuCI namespace top-level ----

/**
 * Parse the LuCI namespace in luci.d.ts and extract type alias names
 * (e.g. requestCallbackFn).
 */
export function parseNamespaceTypeDefs(dtsPath?: string): string[] {
  const path = dtsPath ?? LUCI_DTS;
  const sourceText = readFileSync(path, "utf-8");
  const sf = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const defs: string[] = [];
  let insideLuCI = false;

  function visit(node: ts.Node): void {
    if (
      ts.isModuleDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "LuCI"
    ) {
      insideLuCI = true;
      ts.forEachChild(node, visitInside);
      insideLuCI = false;
      return;
    }
    ts.forEachChild(node, visit);
  }

  function visitInside(node: ts.Node): void {
    if (!insideLuCI) return;
    if (ts.isTypeAliasDeclaration(node) && ts.isIdentifier(node.name)) {
      defs.push(node.name.text);
    }
    ts.forEachChild(node, visitInside);
  }

  visit(sf);
  return defs;
}

// ---- LuCI sub-namespace members (e.g. LuCI.baseclass) ----

/**
 * Parse a sub-namespace declaration file and extract all member/function/type
 * names declared inside `declare namespace LuCI.<name>`.
 *
 * This crawls:
 * - `function` declarations directly in the namespace
 * - `interface` members (property signatures, method signatures)
 * - type alias names
 *
 * The namespace is found by scanning the given file for `declare namespace
 * LuCI.<name>`. If the name is `"baseclass"`, it looks for `LuCI.baseclass`.
 */
export function parseNamespaceMembers(
  namespaceName: string,
  dtsPath?: string,
): string[] {
  let path: string;
  if (dtsPath !== undefined) {
    path = dtsPath;
  } else {
    // Auto-resolve: look in luci/<name>.d.ts
    const candidate = resolve(LUCI_DIR, `${namespaceName}.d.ts`);
    try {
      readFileSync(candidate, "utf-8");
      path = candidate;
    } catch {
      // Fall back to luci.d.ts (for namespaces declared inline, like `view`)
      path = LUCI_DTS;
    }
  }

  const sourceText = readFileSync(path, "utf-8");
  const sf = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const members: string[] = [];
  // Track whether we've found the right sub-namespace
  let targetDepth = 0; // 0 = not entered, 1 = entered, 2+ = nested children

  /**
   * Check if a module declaration matches `LuCI.<namespaceName>`.
   * Two AST shapes are possible:
   *   - Nested: `namespace baseclass { }` inside `namespace LuCI { }`
   *   - QualifiedName: `declare namespace LuCI.baseclass { }`
   */
  function matchesTarget(node: ts.ModuleDeclaration): boolean {
    const name = node.name;
    if (name === undefined) return false;

    // ModuleDeclaration uses Identifier or StringLiteral, never QualifiedName.
    // `namespace LuCI.baseclass` is parsed as nested ModuleDeclarations.
    if (name.kind !== ts.SyntaxKind.Identifier) return false;
    if ((name as ts.Identifier).text !== namespaceName) return false;

    // Walk up to find parent module `LuCI`
    let cur: ts.Node = node.parent;
    while (cur) {
      if (ts.isModuleDeclaration(cur)) {
        const pn = cur.name;
        return (
          pn !== undefined &&
          pn.kind === ts.SyntaxKind.Identifier &&
          (pn as ts.Identifier).text === "LuCI"
        );
      }
      cur = cur.parent;
    }
    return false;
  }

  function visit(node: ts.Node): void {
    if (ts.isModuleDeclaration(node) && matchesTarget(node)) {
      targetDepth = 1;
      ts.forEachChild(node, collect);
      targetDepth = 0;
      return;
    }
    ts.forEachChild(node, visit);
  }

  function collect(node: ts.Node): void {
    if (targetDepth === 0) return;

    if (ts.isFunctionDeclaration(node) && node.name) {
      members.push(node.name.text);
    } else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          members.push(decl.name.text);
        }
      }
    } else if (ts.isTypeAliasDeclaration(node) && node.name) {
      members.push(node.name.text);
    } else if (ts.isInterfaceDeclaration(node) && node.name) {
      // Record the interface name itself
      members.push(node.name.text);
      // Also record its members (property signatures, method signatures)
      for (const m of node.members) {
        if (
          ts.isPropertySignature(m) ||
          ts.isMethodSignature(m)
        ) {
          const n = m.name;
          if (n !== undefined) {
            if (ts.isIdentifier(n)) {
              members.push(n.text);
            } else if (ts.isStringLiteralLike(n)) {
              members.push(n.text);
            }
          }
        }
      }
    } else if (ts.isClassDeclaration(node) && node.name) {
      members.push(node.name.text);
      for (const m of node.members) {
        if (
          ts.isPropertyDeclaration(m) ||
          ts.isMethodDeclaration(m)
        ) {
          const n = m.name;
          if (n !== undefined && ts.isIdentifier(n)) {
            members.push(n.text);
          }
        }
      }
    }

    // Recurse into child containers (ModuleBlock etc.) but not nested namespaces
    if (!ts.isModuleDeclaration(node)) {
      ts.forEachChild(node, collect);
    }
  }

  visit(sf);
  return [...new Set(members)].sort();
}

/**
 * Parse members of a child class, namespace, or interface nested inside
 * a parent LuCI sub-module.
 *
 * For example, to get members of `class AbstractElement` inside `LuCI.ui`,
 * call `parseChildMembers("ui", "AbstractElement")`.
 *
 * Returns all function names, variable names, type alias names, class/interface
 * names with their member names, and class method/property names declared
 * within the matching child node(s).
 */
export function parseChildMembers(
  parentNamespace: string,
  childName: string,
): string[] {
  // Auto-resolve: look in luci/<parentNamespace>.d.ts first
  const candidate = resolve(LUCI_DIR, `${parentNamespace}.d.ts`);
  let path: string;
  try {
    readFileSync(candidate, "utf-8");
    path = candidate;
  } catch {
    path = LUCI_DTS;
  }

  const sourceText = readFileSync(path, "utf-8");
  const sf = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const members: string[] = [];

  /**
   * Check if a module declaration matches `LuCI.<parentNamespace>`.
   */
  function matchesParent(node: ts.ModuleDeclaration): boolean {
    if (!ts.isIdentifier(node.name)) return false;
    if (node.name.text !== parentNamespace) return false;
    // Walk up to find parent module `LuCI`
    let cur: ts.Node = node.parent;
    while (cur) {
      if (ts.isModuleDeclaration(cur)) {
        const pn = cur.name;
        return (
          pn !== undefined &&
          pn.kind === ts.SyntaxKind.Identifier &&
          (pn as ts.Identifier).text === "LuCI"
        );
      }
      cur = cur.parent;
    }
    return false;
  }

  /**
   * Collect member declarations from a node (same logic as parseNamespaceMembers).
   */
  function collect(node: ts.Node): void {
    if (ts.isFunctionDeclaration(node) && node.name) {
      members.push(node.name.text);
    } else if ((ts.isMethodDeclaration(node) || ts.isPropertyDeclaration(node)) && node.name && ts.isIdentifier(node.name)) {
      members.push(node.name.text);
    } else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          members.push(decl.name.text);
        }
      }
    } else if (ts.isTypeAliasDeclaration(node) && node.name) {
      members.push(node.name.text);
    } else if (ts.isInterfaceDeclaration(node) && node.name) {
      members.push(node.name.text);
      for (const m of node.members) {
        if (
          ts.isPropertySignature(m) ||
          ts.isMethodSignature(m)
        ) {
          const n = m.name;
          if (n !== undefined) {
            if (ts.isIdentifier(n)) {
              members.push(n.text);
            } else if (ts.isStringLiteralLike(n)) {
              members.push(n.text);
            }
          }
        }
      }
    } else if (ts.isClassDeclaration(node) && node.name) {
      members.push(node.name.text);
      for (const m of node.members) {
        if (
          ts.isPropertyDeclaration(m) ||
          ts.isMethodDeclaration(m)
        ) {
          const n = m.name;
          if (n !== undefined && ts.isIdentifier(n)) {
            members.push(n.text);
          }
        }
      }
    }

    // Recurse into child containers but not nested namespaces/classes
    if (!ts.isModuleDeclaration(node) && !ts.isClassDeclaration(node)) {
      ts.forEachChild(node, collect);
    }
  }

  function visit(node: ts.Node): void {
    if (ts.isModuleDeclaration(node) && matchesParent(node)) {
      // Found parent namespace — iterate its body (ModuleBlock)
      // looking for a class/interface/module with `childName`
      ts.forEachChild(node, (child) => {
        if (ts.isModuleBlock(child)) {
          ts.forEachChild(child, (decl) => {
            if (
              (ts.isClassDeclaration(decl) ||
               ts.isModuleDeclaration(decl) ||
               ts.isInterfaceDeclaration(decl)) &&
              decl.name !== undefined &&
              ts.isIdentifier(decl.name) &&
              decl.name.text === childName
            ) {
              // Collect members from this child node
              ts.forEachChild(decl, collect);
            }
          });
        }
      });
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return [...new Set(members)].sort();
}

// ---- Module discovery ----

/**
 * Scan all luci/*.d.ts files for `declare namespace LuCI.xxx` declarations,
 * returning the sub-module names.
 */
export function parseLuciSubModules(luciDir?: string, luciDts?: string): string[] {
  const dir = luciDir ?? LUCI_DIR;
  const dts = luciDts ?? LUCI_DTS;
  const names: string[] = [];

  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".d.ts") || f === "form-classes.d.ts") continue;
    const text = readFileSync(resolve(dir, f), "utf-8");
    const m = text.match(/declare namespace LuCI\.(\w+)/);
    if (m) names.push(m[1]);
  }

  // Also check luci.d.ts itself for inline sub-module namespaces
  const mainText = readFileSync(dts, "utf-8");
  const mainRegex = /declare namespace LuCI\.(\w+)/g;
  let mainMatch: RegExpExecArray | null;
  while ((mainMatch = mainRegex.exec(mainText)) !== null) {
    if (mainMatch[1]) names.push(mainMatch[1]);
  }

  return [...new Set(names)].sort();
}
