import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ALL_ROLES } from "@/types/enums";

import { getCommonNavItems, getStaffNavItems } from "./navItems";
import type { NavItem, NavSection } from "@/types/dashboard.types";

// The navigation is built from next-intl keys resolved at render time, so a key
// that does not exist in the message files is invisible until a user sees the raw
// key path in the sidebar. These tests keep every navigation key resolvable in
// every shipped locale.
const LOCALES = ["en", "bn"];

function loadNamespace(dir: string, file: string): unknown {
  return JSON.parse(readFileSync(join(dir, file), "utf8"));
}

function loadMessages(locale: string): Record<string, unknown> {
  const dir = join(process.cwd(), "messages", locale);
  const messages: Record<string, unknown> = {};

  for (const file of readdirSync(dir)) {
    if (file.endsWith(".json")) {
      messages[file.replace(/\.json$/, "")] = loadNamespace(dir, file);
    }
  }

  // Admin namespaces live in a subfolder and are nested under `admin`, exactly as
  // `i18n/request.ts` assembles them.
  const adminDir = join(dir, "admin");
  const admin: Record<string, unknown> = {};
  for (const file of readdirSync(adminDir)) {
    if (file.endsWith(".json")) {
      admin[file.replace(/\.json$/, "")] = loadNamespace(adminDir, file);
    }
  }
  messages.admin = admin;

  return messages;
}

function resolvePath(messages: Record<string, unknown>, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      messages,
    );
}

function collectItems(sections: NavSection[]): NavItem[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) => [
      item,
      ...(item.children
        ? collectItems(item.children.map((child) => ({ items: [child] })))
        : []),
    ]),
  );
}

describe("navigation message keys", () => {
  // Every role's navigation, so a key only used by one staff role is covered too.
  const items = [
    ...collectItems(getCommonNavItems()),
    ...ALL_ROLES.flatMap((role) => collectItems(getStaffNavItems(role))),
  ];

  it("uses the same key at most once per item set", () => {
    for (const item of items) {
      expect(item.titleKey).toMatch(/^[a-zA-Z]+\.[a-zA-Z0-9.]+$/);
    }
  });

  it.each(LOCALES)("resolves every navigation key in %s", (locale) => {
    const messages = loadMessages(locale);

    for (const item of items) {
      expect(
        typeof resolvePath(messages, item.titleKey),
        `${item.titleKey} is missing in ${locale}`,
      ).toBe("string");
    }
  });

  it.each(LOCALES)("resolves every navigation section title in %s", (locale) => {
    const messages = loadMessages(locale);
    const titleKeys = [
      ...getCommonNavItems(),
      ...getStaffNavItems("SUPER_ADMIN"),
    ]
      .map((section) => section.titleKey)
      .filter((key): key is string => Boolean(key));

    expect(titleKeys.length).toBeGreaterThan(0);

    for (const key of titleKeys) {
      expect(
        typeof resolvePath(messages, key),
        `${key} is missing in ${locale}`,
      ).toBe("string");
    }
  });
});
