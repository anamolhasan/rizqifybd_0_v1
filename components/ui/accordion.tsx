"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDown } from "lucide-react"

type AccordionSingleProps = {
  type?: "single"
  value?: string
  onValueChange?: (value: string) => void
}

type AccordionMultipleProps = {
  type: "multiple"
  value?: string[]
  onValueChange?: (value: string[]) => void
}

type AccordionCommonProps = {
  className?: string
  collapsible?: boolean
  disabled?: boolean
  orientation?: "horizontal" | "vertical"
  dir?: "ltr" | "rtl"
  children: React.ReactNode
}

type AccordionProps = AccordionCommonProps & (AccordionSingleProps | AccordionMultipleProps)

function Accordion({
  className,
  type = "single",
  children,
  ...props
}: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      type={type}
      className={cn("w-full", className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {children}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-item flex w-full items-center justify-between gap-4 rounded-lg py-4 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0 text-muted-foreground">{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }