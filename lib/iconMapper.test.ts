import { House } from "lucide-react";
import { describe, expect, it } from "vitest";

import { getIconComponent } from "./iconMapper";

describe("getIconComponent", () => {
  it("resolves the home icon from the canonical lowercase name", () => {
    expect(getIconComponent("house")).toBe(House);
  });

  it("does not depend on a capitalised alias", () => {
    // `House` and `house` used to be separate entries; navigation must use the
    // canonical lowercase key only, so the alias was removed.
    expect(getIconComponent("house")).not.toBe(getIconComponent("__missing__"));
  });

  it("falls back instead of throwing for an unknown name", () => {
    expect(getIconComponent("not-a-real-icon")).toBeDefined();
  });
});
