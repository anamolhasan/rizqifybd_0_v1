"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { SERVICES_ROUTE } from "./nav-config";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

export function SearchBar({ className, autoFocus, onSubmitted }: SearchBarProps) {
  const router = useRouter();
  const t = useTranslations("nav");
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    router.push(
      term ? `${SERVICES_ROUTE}?q=${encodeURIComponent(term)}` : SERVICES_ROUTE,
    );
    onSubmitted?.();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus={autoFocus}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchAriaLabel")}
        className="h-10 rounded-lg pr-20 pl-9"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute top-1/2 right-1 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {t("searchButton")}
      </Button>
    </form>
  );
}
