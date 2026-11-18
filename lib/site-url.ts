/**
 * The public address of the website, used for link previews, the sitemap and
 * robots.txt. Set NEXT_PUBLIC_SITE_URL once the site has its own domain;
 * until then Vercel's production address is used.
 */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
