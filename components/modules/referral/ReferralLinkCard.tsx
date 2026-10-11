"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMyReferral } from "@/hooks/use-referral";
import { buildReferralLink } from "@/lib/referralLink";

export function ReferralLinkCard() {
  const { data: me, isLoading } = useMyReferral();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (isLoading || !me?.referralCode) {
    return null;
  }

  const referralLink = buildReferralLink(me.referralCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied");
    } catch {
      toast.error("Could not copy the referral link");
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: "Join RizqifyBD",
        text: "Sign up with RizqifyBD using my referral link",
        url: referralLink,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share the referral link");
      }
    }
  };

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-400/10 blur-3xl"
      />
      <CardHeader className="gap-2">
        <CardTitle className="text-lg font-bold tracking-tight">
          Your referral link
        </CardTitle>
        <CardDescription>
          Share this link — people who sign up with it are tracked as your
          referrals. Referral income stays gated until your application is
          approved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row">
          <Input
            readOnly
            value={referralLink}
            aria-label="Referral link"
            className="h-11 rounded-xl bg-white/70 font-medium"
            onFocus={(event) => event.currentTarget.select()}
          />
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              onClick={handleCopy}
              className="h-11 rounded-xl"
            >
              {copied ? (
                <>
                  <Check />
                  Copied!
                </>
              ) : (
                <>
                  <Copy />
                  Copy link
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              className="h-11 rounded-xl"
            >
              <Share2 />
              Share
            </Button>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link2 className="size-3.5" />
          Referral code:
          <span className="font-semibold text-foreground">
            {me.referralCode}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}