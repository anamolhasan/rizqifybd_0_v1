// Affiliate share links. There is no pre-existing affiliate share-link
// convention in the app (the referral programme uses `/sign-up?ref=` for a
// different feature), so the attribution query parameter is `aff` and the link
// points at the product page when a product is bound, otherwise the home page.
// The origin resolution mirrors `lib/referralLink.ts`.

function getAppOrigin(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  if (configuredUrl) {
    return configuredUrl;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

export function buildAffiliateSharePath(
  code: string,
  productId: string | null,
): string {
  const encodedCode = encodeURIComponent(code);
  if (productId) {
    // The catalogue detail route is `/services/[id]`. `product` is repeated in the
    // query so the visit tracker can pass the product through explicitly.
    const encodedProduct = encodeURIComponent(productId);
    return `/services/${encodedProduct}?aff=${encodedCode}&product=${encodedProduct}`;
  }
  return `/?aff=${encodedCode}`;
}

export function buildAffiliateShareLink(
  code: string,
  productId: string | null,
): string {
  return `${getAppOrigin()}${buildAffiliateSharePath(code, productId)}`;
}
