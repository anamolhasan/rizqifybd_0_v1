export interface PublicNavLink {
  label: string;
  href: string;
  match: "exact" | "prefix";
}

// Only routes that actually exist in the public (rootLayout) segment are listed here.
export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { label: "হোম", href: "/", match: "exact" },
  { label: "সেবা", href: "/services", match: "prefix" },
  { label: "আমাদের সম্পর্কে", href: "/features", match: "prefix" },
  { label: "প্রশ্নোত্তর", href: "/faq", match: "prefix" },
];

// Public landing route that hosts the service catalogue.
export const SERVICES_ROUTE = "/services";

// Contact details already published in the site Footer.
export const SUPPORT_EMAIL = "info@rizqifybd.com";
export const SUPPORT_PHONE = "+880 1607 950556";
export const SUPPORT_LOCATION = "ব্রাহ্মণবাড়িয়া, বাংলাদেশ";
