"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Package,
  PackageOpen,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  OperatorOfferCard,
  OperatorOfferCardSkeleton,
} from "@/components/offers/OperatorOfferCard";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OFFER_TYPES } from "@/components/modules/operator-offers/add-operator-offer.constants";
import { useOperatorOffers } from "@/hooks/use-operator-offers";
import { useOperators } from "@/hooks/use-operators";
import {
  isOfferCurrentlyAvailable,
  REFERENCE_NOW,
} from "@/lib/operator-offer-display";
import type { IOperatorOfferListParams } from "@/types/operator-offer.types";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 450;
const ALL_VALUE = "all";

// Sort options map to the backend's generic sortBy/sortOrder contract. `price`
// and `name` are plain columns, so they are sortable without server changes.
const SORT_OPTIONS = [
  { value: "createdAt-desc", sortBy: "createdAt", sortOrder: "desc", labelKey: "sortNewest" },
  { value: "price-asc", sortBy: "price", sortOrder: "asc", labelKey: "sortPriceAsc" },
  { value: "price-desc", sortBy: "price", sortOrder: "desc", labelKey: "sortPriceDesc" },
  { value: "name-asc", sortBy: "name", sortOrder: "asc", labelKey: "sortNameAsc" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const OFFER_TYPE_FILTERS = [...OFFER_TYPES];

export default function OperatorOffersCatalogue() {
  const t = useTranslations("offers");
  const tEnums = useTranslations("enums");

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [operatorId, setOperatorId] = useState<string>(ALL_VALUE);
  const [offerType, setOfferType] = useState<string>(ALL_VALUE);
  const [sort, setSort] = useState<SortValue>("createdAt-desc");
  const [page, setPage] = useState(1);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const { data: operatorsData, isLoading: operatorsLoading } = useOperators({
    isActive: true,
    isDeleted: false,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const operators = operatorsData?.data ?? [];

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  const listParams = useMemo<IOperatorOfferListParams>(
    () => ({
      page,
      limit: PAGE_SIZE,
      status: "ACTIVE",
      isActive: true,
      isDeleted: false,
      sortBy: activeSort.sortBy,
      sortOrder: activeSort.sortOrder,
      operatorId: operatorId === ALL_VALUE ? undefined : operatorId,
      offerType:
        offerType === ALL_VALUE ? undefined : (offerType as IOperatorOfferListParams["offerType"]),
      searchTerm: searchTerm || undefined,
    }),
    [page, activeSort, operatorId, offerType, searchTerm],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useOperatorOffers(listParams);

  const offers = useMemo(() => {
    const rows = data?.data ?? [];

    return rows.filter(
      (offer) =>
        offer.status === "ACTIVE" &&
        offer.isActive &&
        !offer.isDeleted &&
        isOfferCurrentlyAvailable(offer, REFERENCE_NOW),
    );
  }, [data]);

  const meta = data?.meta;
  const hasActiveFilters =
    Boolean(searchTerm) ||
    operatorId !== ALL_VALUE ||
    offerType !== ALL_VALUE;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        setSearchTerm(value.trim());
        setPage(1);
      }, SEARCH_DEBOUNCE_MS);
    },
    [],
  );

  const handleOperatorChange = useCallback((value: string) => {
    setOperatorId(value);
    setPage(1);
  }, []);

  const handleOfferTypeChange = useCallback((value: string) => {
    setOfferType(value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value as SortValue);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchInput("");
    setSearchTerm("");
    setOperatorId(ALL_VALUE);
    setOfferType(ALL_VALUE);
    setSort("createdAt-desc");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const gridClassName =
    "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6 xl:grid-cols-4";

  return (
    <section
      id="offers"
      className="relative isolate overflow-hidden bg-muted/30 pb-16 sm:pb-20 lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-105 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-40 -z-10 size-96 rounded-full bg-teal-200/25 blur-[110px]"
      />

      <div className="border-b border-border/60 bg-linear-to-b from-primary/[0.07] via-background to-background">
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
            <Sparkles className="size-4" aria-hidden="true" />
            {t("pageBadge")}
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("pageTitle")}
            <span className="mt-2 block bg-linear-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t("pageTitleAccent")}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("pageSubtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mt-8 gap-4 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-lg shadow-primary/5 backdrop-blur-xl sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
            {t("filtersTitle")}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="offer-search"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {t("searchLabel")}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="offer-search"
                  type="search"
                  inputMode="search"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder={t("searchPlaceholder")}
                  className="h-9 pl-9"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="offer-operator"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {t("operatorLabel")}
              </label>
              <Select value={operatorId} onValueChange={handleOperatorChange}>
                <SelectTrigger id="offer-operator" className="h-9 w-full">
                  <SelectValue placeholder={t("allOperators")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allOperators")}</SelectItem>
                  {operatorsLoading ? (
                    <SelectItem value="__loading" disabled>
                      {t("loading")}
                    </SelectItem>
                  ) : (
                    operators.map((operator) => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="offer-category"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {t("categoryLabel")}
              </label>
              <Select value={offerType} onValueChange={handleOfferTypeChange}>
                <SelectTrigger id="offer-category" className="h-9 w-full">
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allCategories")}</SelectItem>
                  {OFFER_TYPE_FILTERS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {tEnums(`offerType.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="offer-sort"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {t("sortLabel")}
              </label>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger id="offer-sort" className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
                {t("resetFilters")}
              </Button>
            </div>
          ) : null}
        </Card>

        <div ref={resultsRef} className="scroll-mt-24 pt-8 sm:pt-10">
          {isLoading ? (
            <div
              className={gridClassName}
              aria-busy="true"
              aria-label={t("loading")}
            >
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <OperatorOfferCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive" className="mx-auto max-w-xl">
              <AlertCircle />
              <AlertTitle>{t("errorTitle")}</AlertTitle>
              <AlertDescription>
                {error?.message ?? t("errorDescription")}
              </AlertDescription>
              <AlertAction>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCcw />
                  {t("retry")}
                </Button>
              </AlertAction>
            </Alert>
          ) : offers.length === 0 ? (
            <Card className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/30 bg-primary/4 px-6 py-12 text-center shadow-sm">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                {hasActiveFilters ? (
                  <PackageOpen className="size-6" aria-hidden="true" />
                ) : (
                  <Package className="size-6" aria-hidden="true" />
                )}
              </span>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {hasActiveFilters ? t("noResultsTitle") : t("emptyTitle")}
              </h2>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {hasActiveFilters ? t("noResultsDescription") : t("emptyDescription")}
              </p>
              {hasActiveFilters ? (
                <Button type="button" className="mt-1" onClick={resetFilters}>
                  {t("resetFilters")}
                </Button>
              ) : null}
            </Card>
          ) : (
            <>
              <div className={gridClassName}>
                {offers.map((offer) => (
                  <OperatorOfferCard key={offer.id} offer={offer} />
                ))}
              </div>

              {meta ? (
                <DataTablePagination
                  autoPagination={meta}
                  isLoading={isFetching}
                  onPageChange={handlePageChange}
                  className="mt-10 sm:mt-12"
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
