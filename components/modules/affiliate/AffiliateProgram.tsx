"use client";

import { Loader2, RefreshCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgramAuthPrompt } from "@/components/shared/ProgramAuthPrompt";
import { useMyAffiliateApplication } from "@/hooks/use-affiliate-application";
import { useCurrentUser } from "@/hooks/use-auth";
import { AffiliateApplicationForm } from "./AffiliateApplicationForm";
import { AffiliateProgramInfo } from "./AffiliateProgramInfo";
import { AffiliateStatusCard } from "./AffiliateStatusCard";

export function AffiliateProgram() {
  const t = useTranslations("affiliate.program");
  const tc = useTranslations("common");
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthed = Boolean(user);
  const { data: status, isLoading, isError, error, refetch, isFetching } =
    useMyAffiliateApplication(isAuthed);

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 size-144 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 size-96 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-1.5 text-xs font-semibold text-primary sm:text-sm">
            <Sparkles className="size-4" />
            {t("eyebrow")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.rich("heading", {
              brand: (chunks) => (
                <span className="bg-linear-to-r from-primary via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {t("description")}
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            {isUserLoading ? (
              <AffiliateActionSkeleton />
            ) : !user ? (
              <ProgramAuthPrompt />
            ) : isLoading ? (
              <AffiliateActionSkeleton />
            ) : isError ? (
              <Alert variant="destructive" role="alert">
                <TriangleAlert />
                <AlertTitle>{t("loadFailedTitle")}</AlertTitle>
                <AlertDescription>
                  <p>
                    {error instanceof Error ? error.message : t("loadFailedBody")}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <RefreshCcw />
                    )}
                    {tc("retry")}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : status?.application ? (
              <AffiliateStatusCard status={status} />
            ) : (
              <AffiliateApplicationForm user={user} />
            )}
          </div>

          <AffiliateProgramInfo />
        </div>
      </div>
    </section>
  );
}

function AffiliateActionSkeleton() {
  return (
    <Card className="rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/4 ring-0 backdrop-blur-xl sm:rounded-3xl">
      <CardHeader className="gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-5">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}
