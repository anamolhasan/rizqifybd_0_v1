export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

// Mirrors the backend upload limits (see upload.middleware.ts).
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageFileValidationError = "invalidType" | "tooLarge";

export function validateImageFile(
  file: Pick<File, "type" | "size"> | { type: string; size: number },
): ImageFileValidationError | null {
  if (
    !(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    return "invalidType";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "tooLarge";
  }

  return null;
}
