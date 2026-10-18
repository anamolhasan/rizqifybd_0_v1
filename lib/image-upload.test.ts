import { describe, expect, it } from "vitest";

import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  validateImageFile,
} from "./image-upload";

describe("validateImageFile", () => {
  it("accepts every allowed image mime type at the size limit", () => {
    for (const type of ALLOWED_IMAGE_MIME_TYPES) {
      expect(validateImageFile({ type, size: MAX_IMAGE_SIZE_BYTES })).toBeNull();
    }
  });

  it("rejects unsupported mime types", () => {
    expect(validateImageFile({ type: "application/pdf", size: 1024 })).toBe(
      "invalidType",
    );
    expect(validateImageFile({ type: "image/svg+xml", size: 1024 })).toBe(
      "invalidType",
    );
    expect(validateImageFile({ type: "", size: 1024 })).toBe("invalidType");
  });

  it("rejects files larger than the maximum size", () => {
    expect(
      validateImageFile({ type: "image/png", size: MAX_IMAGE_SIZE_BYTES + 1 }),
    ).toBe("tooLarge");
    expect(
      validateImageFile({ type: "image/png", size: MAX_IMAGE_SIZE_BYTES * 2 }),
    ).toBe("tooLarge");
  });

  it("does not flag an empty allowed image as a size error", () => {
    expect(validateImageFile({ type: "image/png", size: 0 })).toBeNull();
  });
});
