import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, heroSlides } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { getSettingsFresh } from "@/lib/server/admin-reads";
import { PageTitle } from "@/components/admin/ui";
import { HeroBrandForm, HeroSlides } from "./HeroAdmin";

export const metadata = { title: "Home page hero" };

export default async function HeroAdminPage() {
  await requireAdmin();
  const [hero, slides, cats] = await Promise.all([
    getSettingsFresh("hero"),
    db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder), asc(heroSlides.id)),
    db.select({ id: categories.id, label: categories.label }).from(categories).orderBy(asc(categories.sortOrder)),
  ]);
  const visibleCount = slides.filter((s) => s.visible).length;

  return (
    <div className="max-w-5xl">
      <PageTitle title="Home page hero" intro="The first thing visitors see: the brand text, the background video and the rotating slides." />
      <HeroBrandForm initial={hero} />
      <HeroSlides
        categories={cats}
        slides={slides.map((s) => ({
          id: s.id,
          name: s.name,
          eyebrow: s.eyebrow,
          title: s.title,
          description: s.description,
          tag: s.tag,
          categoryId: s.categoryId,
          visible: s.visible,
          image: s.image,
          // The last visible slide can't be hidden or deleted.
          locked: s.visible && visibleCount === 1,
        }))}
      />
    </div>
  );
}
