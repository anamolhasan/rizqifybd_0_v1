export interface PublicNavLink {
  labelKey: string;
  href: string;
  match: "exact" | "prefix";
}

// Only routes that actually exist in the public (rootLayout) segment are listed here.
// Labels are translation keys resolved with next-intl at render time.
export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { labelKey: "nav.home", href: "/", match: "exact" },
  { labelKey: "nav.services", href: "/services", match: "prefix" },
  { labelKey: "nav.about", href: "/features", match: "prefix" },
  { labelKey: "nav.faq", href: "/faq", match: "prefix" },
  { labelKey: "nav.agent", href: "/agent", match: "prefix" },
  { labelKey: "nav.affiliate", href: "/affiliate", match: "prefix" },
  { labelKey: "nav.referral", href: "/referral", match: "prefix" },
];

// Public landing route that hosts the service catalogue.
export const SERVICES_ROUTE = "/services";

// Route convention for a single operator offer's public details page. The page
// itself is implemented in a later step; cards link here so navigation is ready.
export const OFFER_DETAILS_ROUTE = (offerId: string) =>
  `${SERVICES_ROUTE}/${encodeURIComponent(offerId)}`;

// Contact details already published in the site Footer.
export const SUPPORT_EMAIL = "info@rizqifybd.com";
export const SUPPORT_PHONE = "+880 1607 950556";
