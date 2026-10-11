import { Gift, TrendingUp, Wallet } from "lucide-react";

import { CurrencyCell } from "@/components/shared/cell/CurrencyCell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuthUser } from "@/lib/auth-api";

interface ProfileEarningsCardProps {
  user: AuthUser;
  className?: string;
}

export function ProfileEarningsCard({ user, className }: ProfileEarningsCardProps) {
  const appUser = user.appUser;
  if (!appUser) return null;

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>Wallet &amp; Earnings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Wallet className="size-3.5" />
              Available balance
            </div>
            <p className="mt-1.5 text-lg font-bold">
              <CurrencyCell value={appUser.balance} />
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <TrendingUp className="size-3.5" />
              Total earned
            </div>
            <p className="mt-1.5 text-lg font-bold">
              <CurrencyCell value={appUser.totalEarned} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={appUser.canEarn ? "default" : "outline"}>
            {appUser.canEarn ? "Earning enabled" : "Earning disabled"}
          </Badge>
          {appUser.referralIncomeEligible ? (
            <Badge
              variant="outline"
              className="gap-1 text-emerald-600 dark:text-emerald-400"
            >
              <Gift className="size-3" />
              Referral income eligible
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
