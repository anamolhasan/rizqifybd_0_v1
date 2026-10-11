"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { useCreateOperator, useUpdateOperator } from "@/hooks/use-operators";
import type {
  ICreateOperatorPayload,
  IOperator,
} from "@/types/operator.types";

const FIELD_NAMES = ["name", "code"] as const;
type OperatorFieldName = (typeof FIELD_NAMES)[number];

function isOperatorField(path: string): path is OperatorFieldName {
  return (FIELD_NAMES as readonly string[]).includes(path);
}

// Mirrors the backend Operator validation (name + code required; see
// operator.validation.ts) and the column constraints (name VarChar(100),
// code VarChar(20)).
const operatorSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Operator name is required" })
    .max(100, { message: "Operator name must be at most 100 characters" }),
  code: z
    .string()
    .min(1, { message: "Code is required" })
    .max(20, { message: "Code must be at most 20 characters" }),
  isActive: z.boolean(),
});

export type OperatorFormValues = z.infer<typeof operatorSchema>;

const DEFAULT_VALUES: OperatorFormValues = {
  name: "",
  code: "",
  isActive: true,
};

interface OperatorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator?: IOperator | null;
}

export function OperatorFormDialog({
  open,
  onOpenChange,
  operator,
}: OperatorFormDialogProps) {
  const isEditing = Boolean(operator);

  const {
    mutateAsync: createOperator,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateOperator();

  const {
    mutateAsync: updateOperator,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateOperator();

  const isSubmitting = isCreating || isUpdating;
  const submissionError = isEditing ? updateError : createError;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<OperatorFormValues>({
    resolver: standardSchemaResolver(operatorSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    resetCreate();
    resetUpdate();
    reset(
      operator
        ? {
            name: operator.name,
            code: operator.code,
            isActive: operator.isActive,
          }
        : DEFAULT_VALUES,
    );
  }, [open, operator, reset, resetCreate, resetUpdate]);

  // Surface backend field-level validation errors on the matching inputs.
  useEffect(() => {
    if (!submissionError?.errorSources?.length) return;
    for (const source of submissionError.errorSources) {
      if (isOperatorField(source.path)) {
        setError(source.path, { type: "server", message: source.message });
      }
    }
  }, [submissionError, setError]);

  const hasFieldError = Boolean(
    submissionError?.errorSources?.some((source) =>
      isOperatorField(source.path),
    ),
  );
  const formError =
    submissionError && !hasFieldError
      ? (submissionError.errorSources?.[0]?.message ?? submissionError.message)
      : null;

  const submit = async (values: OperatorFormValues) => {
    if (isSubmitting) return;

    clearErrors();
    const payload: ICreateOperatorPayload = {
      name: values.name.trim(),
      code: values.code.trim(),
      isActive: values.isActive,
    };

    try {
      if (isEditing && operator) {
        await updateOperator({ id: operator.id, payload });
      } else {
        await createOperator(payload);
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
          <DialogTitle>{isEditing ? "Edit Operator" : "Add Operator"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the operator details below."
              : "Create a new telecom operator for your catalogue."}
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
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="operator-name">Operator Name</FieldLabel>
              <Input
                id="operator-name"
                placeholder="e.g. Grameenphone"
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.code)}>
              <FieldLabel htmlFor="operator-code">Code</FieldLabel>
              <Input
                id="operator-code"
                placeholder="e.g. GP"
                aria-invalid={Boolean(errors.code)}
                disabled={isSubmitting}
                {...register("code")}
              />
              <FieldError errors={[errors.code]} />
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor="operator-active">Active</FieldLabel>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    id="operator-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
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
                "Create Operator"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
