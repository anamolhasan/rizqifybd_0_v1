export type QueryParamValue = string | string[] | number | null | undefined;

function appendQueryParam(
  params: URLSearchParams,
  key: string,
  value: QueryParamValue,
) {
  if (value === undefined || value === null || value === "") return;
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item) params.append(key, item);
    });
    return;
  }
  params.set(key, String(value));
}

export function buildQueryString(
  params: Record<string, QueryParamValue>,
): string {
  const search = new URLSearchParams();
  (Object.keys(params) as string[]).forEach((key) => {
    appendQueryParam(search, key, params[key]);
  });
  const queryString = search.toString();
  return queryString ? `?${queryString}` : "";
}

export async function buildQueryStringFromSearchParams(
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>,
): Promise<string> {
  const resolved = await searchParams;
  const search = new URLSearchParams();
  for (const key of Object.keys(resolved)) {
    const value = resolved[key];
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
    } else if (value) {
      search.set(key, value);
    }
  }
  const queryString = search.toString();
  return queryString ? `?${queryString}` : "";
}

export function normalizeQueryString(queryString: string): string {
  const cleaned = queryString.startsWith("?") ? queryString.slice(1) : queryString;
  return cleaned ? `?${cleaned}` : "";
}