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
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                {t("goHome")}
              </Button>
            </Link>
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
            <a href="/services" className="text-primary hover:underline">
              {t("browseServices")}
            </a>
            <span aria-hidden="true">·</span>
            <a href="/faq" className="text-primary hover:underline">
              {t("visitFaq")}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}