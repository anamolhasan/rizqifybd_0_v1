"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import type { ICategory } from "@/types/category.types";

const FIELD_NAMES = ["title", "description"] as const;
type CategoryFieldName = (typeof FIELD_NAMES)[number];

function isCategoryField(path: string): path is CategoryFieldName {
  return (FIELD_NAMES as readonly string[]).includes(path);
}

// Mirrors the backend Specialty validation (title required; description optional)
// and the title column constraint (VarChar(100)).
const categorySchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

const DEFAULT_VALUES: CategoryFormValues = {
  title: "",
  description: "",
};

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ICategory | null;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category);

  const {
    mutateAsync: createCategory,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateCategory();

  const {
    mutateAsync: updateCategory,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateCategory();

  const isSubmitting = isCreating || isUpdating;
  const submissionError = isEditing ? updateError : createError;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: standardSchemaResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset(
      category
        ? {
            title: category.title,
            description: category.description ?? "",
          }
        : DEFAULT_VALUES,
    );
  }, [open, category, reset, resetCreate, resetUpdate]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      if (isCategoryField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some((source) =>
      isCategoryField(source.path),
    ),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: CategoryFormValues) => {
    if (isSubmitting) return;

    clearErrors();
    const description = values.description?.trim();
    const payload = {
      title: values.title.trim(),
      ...(description ? { description } : {}),
    };

    try {
      if (isEditing && category) {
        await updateCategory({ id: category.id, payload });
      } else {
        await createCategory(payload);
      }
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    } catch {
      // Errors are surfaced via toast and the field-error effect above.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details below."
              : "Create a new category for your product catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate>
          {formError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="category-title">Title</FieldLabel>
              <Input
                id="category-title"
                placeholder="e.g. Mobile Recharge"
                aria-invalid={Boolean(errors.title)}
                disabled={isSubmitting}
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="category-description">Description</FieldLabel>
              <Textarea
                id="category-description"
                rows={3}
                placeholder="Optional short description"
                aria-invalid={Boolean(errors.description)}
                disabled={isSubmitting}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
