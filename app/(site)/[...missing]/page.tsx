import { notFound } from "next/navigation";

/**
 * Any address the website doesn't have lands here, so the 404 page
 * (app/(site)/not-found.tsx) is shown with the site's header and footer.
 */
export default function MissingPage() {
  notFound();
}
