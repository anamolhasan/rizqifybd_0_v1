import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandLogo } from "@/components/auth/BrandLogo"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-10 px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>

          <BrandLogo className="mx-auto mb-6" />

          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">
            404
          </h1>

          <h2 className="mb-3 text-xl font-semibold text-foreground">
            {t("title")}
          </h2>

          <p className="mb-8 text-muted-foreground">
            {t("description")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2">
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden="true" />
                {t("goHome")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("goBack")}
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{t("or")}</span>
            <Link href="/services" className="text-primary hover:underline">
              {t("browseServices")}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/faq" className="text-primary hover:underline">
              {t("visitFaq")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}