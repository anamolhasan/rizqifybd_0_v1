function createNumberFormatter(
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  return new Intl.NumberFormat("en-BD", options);
}

function createDateFormatter(
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-GB", options);
}

export function formatBDT(amount: number | string | null | undefined): string {
  const numeric = Number(amount ?? 0);
  if (Number.isNaN(numeric)) return "৳0.00";
  return createNumberFormatter({ style: "currency", currency: "BDT" }).format(
    numeric,
  );
}

export function formatNumber(amount: number | string | null | undefined): string {
  const numeric = Number(amount ?? 0);
  if (Number.isNaN(numeric)) return "0";
  return createNumberFormatter({ maximumFractionDigits: 2 }).format(numeric);
}

export function formatDate(
  value: string | Date | null | undefined,
): string {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return createDateFormatter({
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return createDateFormatter({
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(
  value: string | Date | null | undefined,
  locale = "en",
): string {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secondsInUnit] of units) {
    const amount = Math.floor(seconds / secondsInUnit);
    if (amount >= 1) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -amount,
        unit,
      );
    }
  }
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    0,
    "second",
  );
}