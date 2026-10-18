"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { validateImageFile } from "@/lib/image-upload";
import { uploadImage } from "@/lib/upload-api";

export interface ImageUploadFieldLabels {
  label: string;
  select: string;
  replace: string;
  uploading: string;
  hint: string;
  invalidType: string;
  tooLarge: string;
  uploadFailed: string;
}

interface ImageUploadFieldProps {
  id?: string;
  value?: string | null;
  // Reports the uploaded pair together so the caller can persist `logo` and
  // `logoPublicId` in one step - a URL without its handle cannot be managed.
  onChange: (secureUrl: string | undefined, publicId: string | undefined) => void;
  onUploadingChange?: (uploading: boolean) => void;
  disabled?: boolean;
  labels: ImageUploadFieldLabels;
}

export function ImageUploadField({
  id,
  value,
  onChange,
  onUploadingChange,
  disabled = false,
  labels,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setObjectUrl(null);
  };

  const setUploading = (next: boolean) => {
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again re-triggers the change handler.
    event.target.value = "";

    if (!file || isUploading) return;

    setError(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(
        validationError === "tooLarge" ? labels.tooLarge : labels.invalidType,
      );
      return;
    }

    clearObjectUrl();
    const previewObjectUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewObjectUrl;
    setObjectUrl(previewObjectUrl);
    setUploading(true);

    try {
      const result = await uploadImage(file);
      clearObjectUrl();
      onChange(result.secureUrl, result.publicId);
    } catch {
      clearObjectUrl();
      setError(labels.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const inputId = id ?? "image-upload";
  const buttonDisabled = disabled || isUploading;
  // A freshly selected file shows its local object URL until the upload
  // resolves, after which the persisted value (or the previous one) is shown.
  const previewUrl = objectUrl ?? value ?? null;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={inputId}>{labels.label}</FieldLabel>

      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
          {previewUrl ? (
            // Blob and remote preview URLs both need a plain img element;
            // next/image cannot render object URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={labels.label}
              className="size-full object-contain"
            />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={buttonDisabled}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            {isUploading
              ? labels.uploading
              : previewUrl
                ? labels.replace
                : labels.select}
          </Button>
          <FieldDescription>{labels.hint}</FieldDescription>
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={buttonDisabled}
        onChange={(event) => {
          void handleFileChange(event);
        }}
      />

      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
