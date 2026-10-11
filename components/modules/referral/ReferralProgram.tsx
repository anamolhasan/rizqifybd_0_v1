"use client";

import { Loader2, RefreshCcw, Sparkles, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyReferral } from "@/hooks/use-referral";
import { ReferralApplicationForm } from "./ReferralApplicationForm";
import { ReferralLinkCard } from "./ReferralLinkCard";
import { ReferralProgramInfo } from "./ReferralProgramInfo";
import { ReferralStatusCard } from "./ReferralStatusCard";

export function ReferralProgram() {
  const { data: user } = useCurrentUser();
  const { data: me, isLoading, isError, error, refetch, isFetching } =
    useMyReferral();

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 size-144 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-1.5 text-xs font-semibold text-primary sm:text-sm">
            <Sparkles className="size-4" />
            রেফারেল প্রোগ্রাম
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            রেফার করে আয় করুন{" "}
            <span className="bg-linear-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              RizqifyBD
            </span>
            {" "}এর সাথে
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            আপনার পরিচিতদের RizqifyBD-তে যুক্ত করুন এবং প্রতিটি সফল রেফারেলে
            আকর্ষণীয় আয় করুন। নিচের নিয়মাবলী পড়ে আজই আবেদন করুন।
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <ReferralLinkCard />

            {isLoading ? (
              <ReferralActionSkeleton />
            ) : isError ? (
              <Alert variant="destructive" role="alert">
                <TriangleAlert />
                <AlertTitle>তথ্য লোড করা যায়নি</AlertTitle>
                <AlertDescription>
                  <p>
                    {error instanceof Error
                      ? error.message
                      : "সার্ভার থেকে তথ্য আনতে সমস্যা হয়েছে।"}
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
                    আবার চেষ্টা করুন
                  </Button>
                </AlertDescription>
              </Alert>
            ) : me?.application ? (
              <ReferralStatusCard me={me} />
            ) : (
              <ReferralApplicationForm user={user} />
            )}
          </div>

          <ReferralProgramInfo />
        </div>
      </div>
    </section>
  );
}

function ReferralActionSkeleton() {
  return (
    <Card className="rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/4 ring-0 backdrop-blur-xl sm:rounded-3xl">
      <CardHeader className="gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-5">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}
