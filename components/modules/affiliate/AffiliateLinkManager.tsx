"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiError } from "@/lib/api";
import {
  createAffiliateLink,
  updateAffiliateLink,
} from "@/lib/affiliate-program-api";
import { buildAffiliateShareLink } from "@/lib/affiliateLink";
import { formatDate, formatNumber } from "@/lib/format";
import type { IAffiliateLink } from "@/types/program.types";

interface AffiliateLinkManagerProps {
  links: IAffiliateLink[];
}

function describeError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.errorSources?.length) {
      return error.errorSources.map((source) => source.message).join(", ");
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function AffiliateLinkManager({ links }: AffiliateLinkManagerProps) {
  const t = useTranslations("affiliate.links");
  const td = useTranslations("affiliate.dashboard");
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [productId, setProductId] = useState("");
  const [creating, setCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    try {
      // Only the label and an optional product id are client-supplied; the code,
      // owner and counters are all server-controlled.
      await createAffiliateLink({
        label: label.trim() || null,
        productId: productId.trim() || null,
      });
      setLabel("");
      setProductId("");
      toast.success(t("createSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("createError"), {
        description: describeError(error, t("createError")),
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (link: IAffiliateLink, next: boolean) => {
    setPendingId(link.id);
    try {
      await updateAffiliateLink(link.id, { isActive: next });
      toast.success(t("updateSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("updateError"), {
        description: describeError(error, t("updateError")),
      });
    } finally {
      setPendingId(null);
    }
  };

  const handleCopy = async (link: IAffiliateLink) => {
    const url = buildAffiliateShareLink(link.code, link.productId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(link.id);
      toast.success(t("copied"));
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error(t("copyError"));
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreate} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-sm font-semibold">{t("createTitle")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="affiliate-link-label">{t("label")}</Label>
              <Input
                id="affiliate-link-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder={t("labelPlaceholder")}
                disabled={creating}
                maxLength={150}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="affiliate-link-product">{t("productId")}</Label>
              <Input
                id="affiliate-link-product"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                placeholder={t("productIdPlaceholder")}
                disabled={creating}
              />
            </div>
          </div>
          <Button type="submit" disabled={creating} className="mt-3">
            {creating ? <Loader2 className="animate-spin" /> : <Plus />}
            {creating ? t("creating") : t("create")}
          </Button>
        </form>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
            <p className="text-sm font-semibold">
              {td("noLinksTitle")}
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {td("noLinksBody")}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {links.map((link) => {
              const shareLink = buildAffiliateShareLink(
                link.code,
                link.productId,
              );
              const busy = pendingId === link.id;
              return (
                <li
                  key={link.id}
                  className="rounded-2xl border border-border/60 bg-card p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          {link.code}
                        </span>
                        <Badge variant={link.isActive ? "default" : "outline"}>
                          {link.isActive
                            ? t("activeLabel")
                            : t("inactiveLabel")}
                        </Badge>
                      </div>
                      {link.label ? (
                        <p className="text-sm text-muted-foreground">
                          {link.label}
                        </p>
                      ) : null}
                      <p className="font-mono text-xs break-all text-muted-foreground">
                        {shareLink}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.isActive}
                          disabled={busy}
                          onCheckedChange={(checked) =>
                            handleToggle(link, checked)
                          }
                          aria-label={
                            link.isActive ? t("deactivate") : t("activate")
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          {link.isActive ? t("deactivate") : t("activate")}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(link)}
                      >
                        {copiedId === link.id ? <Check /> : <Copy />}
                        {copiedId === link.id ? t("copied") : t("copyLink")}
                      </Button>
                    </div>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <dt className="text-muted-foreground">
                        {t("clicksLabel")}
                      </dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">
                        {formatNumber(link.clickCount)}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <dt className="text-muted-foreground">
                        {t("attributionsLabel")}
                      </dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">
                        {formatNumber(link.attributionCount)}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <dt className="text-muted-foreground">
                        {t("createdOn")}
                      </dt>
                      <dd className="mt-0.5 font-semibold">
                        {formatDate(link.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
