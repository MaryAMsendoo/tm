/**
 * One-time content migration: lib/data.ts + public/ media -> Neon + Cloudinary.
 *
 *   npm run db:seed            refuses if content already exists
 *   npm run db:seed -- --reset deletes catalogue and site content first
 *                              (enquiries and admin accounts are kept)
 *
 * Safe to re-run with --reset: uploads use fixed public IDs and overwrite: false,
 * so files already in Cloudinary are reused, not duplicated.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db, pool } from "../db";
import * as t from "../db/schema";
import type { MediaRef } from "../db/schema";
import { MEDIA_FOLDER, getCloudinary } from "../lib/cloudinary-server";
import { videoPosterUrl } from "../lib/media";
import { settingsSchemas } from "../lib/content-schemas";
import * as data from "../lib/data";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const reset = process.argv.includes("--reset");

// ------------------------------------------------------------------ uploads

const uploaded = new Map<string, MediaRef>();

async function upload(src: string): Promise<MediaRef> {
  const cached = uploaded.get(src);
  if (cached) return cached;

  const file = path.join(PUBLIC_DIR, decodeURIComponent(src.replace(/^\//, "")));
  if (!existsSync(file)) throw new Error(`Missing file in public/: ${src}`);

  const kind = /\.(mp4|webm|mov|m4v)$/i.test(src) ? "video" : "image";
  const name = path.basename(src).replace(/\.[^.]+$/, "");
  const res = await getCloudinary().uploader.upload(file, {
    resource_type: kind,
    public_id: name,
    folder: `${MEDIA_FOLDER}/library`,
    overwrite: false,
    unique_filename: false,
  });

  const ref: MediaRef = {
    kind,
    publicId: res.public_id,
    url: res.secure_url,
    width: res.width ?? null,
    height: res.height ?? null,
    posterUrl: kind === "video" ? videoPosterUrl(res.secure_url) : null,
  };
  uploaded.set(src, ref);
  return ref;
}

/** Upload many files, a few at a time, with progress. */
async function uploadAll(srcs: string[]) {
  const unique = [...new Set(srcs)];
  let done = 0;
  const queue = [...unique];
  const worker = async () => {
    for (let src = queue.shift(); src; src = queue.shift()) {
      await upload(src);
      done += 1;
      if (done % 20 === 0 || done === unique.length) console.log(`  uploaded ${done}/${unique.length}`);
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
}

/** A video's poster: a real photo when lib/data.ts names one, else a Cloudinary still frame. */
async function videoRef(src: string, poster?: string): Promise<MediaRef> {
  const ref = await upload(src);
  if (poster && !poster.endsWith("-poster.jpeg")) {
    return { ...ref, posterUrl: (await upload(poster)).url };
  }
  return ref;
}

// --------------------------------------------- showroom series -> products

/**
 * Showroom series that were not shop products before. They become products
 * with inShop = false, so the shop grid looks exactly as it did; the admin
 * can list them in the shop later. Keys are archive ids with "archive-",
 * the trailing "-<n>" and "-video" removed.
 */
const newSeries: Record<string, { slug: string; name: string; category: string; description: string }> = {
  "kitchen-collection": { slug: "kitchen-collection", name: "Fitted kitchen collection", category: "kitchen", description: "Fitted kitchens with full-height cabinets, worktops and storage planned around the room." },
  "kitchen-teal-site": { slug: "kitchen-teal-site", name: "Teal kitchen", category: "kitchen", description: "A dark teal kitchen with white wall cabinets, finished on site." },
  "kitchen-install": { slug: "kitchen-install", name: "Kitchen installation", category: "kitchen", description: "Our carpenters fitting kitchen cabinets on site." },
  "bookshelf-oak": { slug: "bookshelf-oak", name: "Oak bookshelf with cabinet base", category: "living-room", description: "Floor-to-ceiling open shelving in a warm oak finish, over a three-door cabinet base." },
  "bookshelf-oak-maker": { slug: "bookshelf-oak", name: "", category: "", description: "" },
  "tv-console-grey": { slug: "tv-console-grey", name: "Grey TV wall and floating console", category: "living-room", description: "A full-width wall panel with a long, wall-hung grey console with drawers and open bays." },
  "bed-grey-upholstered": { slug: "bed-grey-upholstered", name: "Grey upholstered panel bed", category: "bedroom", description: "A 4x6 bed frame with a tall padded headboard and a matching upholstered base." },
  "office-executive-suite": { slug: "office-executive-suite", name: "Executive office fit-out", category: "office", description: "Executive desks, a back-wall storage unit and lounge seating for a working office." },
  "wardrobe-white-gloss": { slug: "wardrobe-white-gloss", name: "White gloss wardrobe", category: "wardrobes", description: "White gloss wardrobes with long black handles, open shelving and drawers." },
  "wardrobe-install": { slug: "wardrobe-install", name: "Wardrobe installation", category: "wardrobes", description: "Full-height wardrobe walls being fitted on site by our team." },
  "wardrobe-oak-storage": { slug: "wardrobe-oak-storage", name: "Built-in oak storage wardrobe", category: "wardrobes", description: "A full-height oak wardrobe with built-in storage shelves behind the doors." },
  "store-shelves": { slug: "store-shelves", name: "Store room shelving", category: "custom", description: "Wall-mounted oak shelves on steel brackets, built to fit a store room." },
  "chairs-gilded": { slug: "chairs-gilded", name: "Gilded chairs", category: "sofas", description: "Carved, gold-finished chairs made in our workshop." },
  // Videos that belong to existing shop products.
  "sofa-grey-curved": { slug: "sofa-grey-curved", name: "", category: "", description: "" },
  "armchair-red-tufted": { slug: "sofa-red-tufted", name: "", category: "", description: "" },
};

const seriesKey = (archiveId: string) =>
  archiveId.replace(/^archive-/, "").replace(/-\d+$/, "").replace(/-video$/, "");

// --------------------------------------------------------------------- main

async function main() {
  const [{ n: existing }] = await db.select({ n: count() }).from(t.categories);
  if (existing > 0 && !reset) {
    console.error("The database already has content. Nothing was changed.");
    console.error("To replace catalogue and site content with lib/data.ts, run: npm run db:seed -- --reset");
    console.error("(Enquiries and admin accounts are never touched.)");
    process.exitCode = 1;
    return;
  }

  // Upload everything first, so a failed upload leaves the database untouched.
  console.log("Uploading media to Cloudinary...");
  const allSrcs = [
    ...data.showroomArchiveItems.flatMap((i) => [i.image, ...(i.poster && !i.poster.endsWith("-poster.jpeg") ? [i.poster] : [])]),
    ...data.products.flatMap((p) => p.images),
    ...data.portfolioProjects.map((p) => p.image),
    ...data.featuredVideos.map((v) => v.src),
    ...data.heroSlides.map((s) => s.image),
    ...data.testimonials.flatMap((x) => (x.avatar ? [x.avatar] : [])),
    data.ceoMessage.photo,
    data.ceoMessage.portrait,
    "/bookshelf-oak-maker-001.jpeg", // About page "Our story" photo
  ];
  await uploadAll(allSrcs);

  // Every lookup below hits the in-memory map, never the network.
  const ref = (src: string) => upload(src);

  await db.transaction(async (tx) => {
    if (reset) {
      console.log("Resetting catalogue and site content...");
      await tx.delete(t.productMedia);
      await tx.delete(t.products);
      await tx.delete(t.portfolioItems);
      await tx.delete(t.heroSlides);
      await tx.delete(t.categories);
      await tx.delete(t.testimonials);
      await tx.delete(t.settings);
    }

    // Categories
    const cats = await tx
      .insert(t.categories)
      .values(data.categories.map((c, i) => ({ slug: c.slug, label: c.label, sortOrder: i })))
      .returning();
    const catId = (slug: string) => {
      const c = cats.find((x) => x.slug === slug);
      if (!c) throw new Error(`Unknown category: ${slug}`);
      return c.id;
    };

    // Shop products, in their current order.
    const productRows = await tx
      .insert(t.products)
      .values(
        data.products.map((p, i) => ({
          slug: p.id,
          name: p.name,
          categoryId: catId(p.category),
          description: p.description,
          dimensions: p.dimensions ?? null,
          materials: p.materials ?? null,
          customisable: p.customisable,
          featured: p.featured ?? false,
          inShop: true,
          sortOrder: i,
        })),
      )
      .returning();
    const productBySlug = new Map(productRows.map((p) => [p.slug, p]));

    // Series that only existed in the showroom.
    let order = productRows.length;
    for (const s of Object.values(newSeries)) {
      if (!s.name || productBySlug.has(s.slug)) continue;
      const [row] = await tx
        .insert(t.products)
        .values({ slug: s.slug, name: s.name, categoryId: catId(s.category), description: s.description, inShop: false, sortOrder: order++ })
        .returning();
      productBySlug.set(row.slug, row);
    }

    // Media: each product's shop images first (card order), then the rest of its showroom items.
    const mediaRows: (typeof t.productMedia.$inferInsert)[] = [];
    const nextSort = new Map<number, number>();
    const pushMedia = (productId: number, m: MediaRef, title: string | null, description: string | null) => {
      const sortOrder = nextSort.get(productId) ?? 0;
      nextSort.set(productId, sortOrder + 1);
      mediaRows.push({ productId, kind: m.kind, publicId: m.publicId, url: m.url, posterUrl: m.posterUrl ?? null, width: m.width ?? null, height: m.height ?? null, title, description, sortOrder });
    };

    const archiveBySrc = new Map(data.showroomArchiveItems.map((i) => [i.image, i]));
    const placed = new Set<string>();
    for (const p of data.products) {
      const product = productBySlug.get(p.id)!;
      for (const src of p.images) {
        const a = archiveBySrc.get(src);
        pushMedia(product.id, await ref(src), a?.title ?? null, a?.description ?? null);
        placed.add(src);
      }
    }
    for (const a of data.showroomArchiveItems) {
      if (placed.has(a.image)) continue;
      const key = seriesKey(a.id);
      const slug = newSeries[key]?.slug ?? key;
      const product = productBySlug.get(slug);
      if (!product) throw new Error(`No product for showroom item ${a.id} (series "${key}")`);
      const m = a.type === "video" ? await videoRef(a.image, a.poster) : await ref(a.image);
      pushMedia(product.id, m, a.title, a.description);
      placed.add(a.image);
    }
    await tx.insert(t.productMedia).values(mediaRows);

    // Portfolio: projects interleaved with featured videos, as the pages show them today.
    const portfolio: (typeof t.portfolioItems.$inferInsert)[] = [];
    for (const [i, p] of data.portfolioProjects.entries()) {
      portfolio.push({ title: p.title, categoryId: catId(p.category), location: p.location ?? null, media: await ref(p.image) });
      const v = data.featuredVideos[i];
      if (v) portfolio.push({ title: v.title, categoryId: catId(v.category), media: await videoRef(v.src, v.poster) });
    }
    await tx.insert(t.portfolioItems).values(portfolio.map((p, i) => ({ ...p, sortOrder: i })));

    // Hero slides
    await tx.insert(t.heroSlides).values(
      await Promise.all(
        data.heroSlides.map(async (s, i) => ({
          name: s.name,
          categoryId: s.category ? catId(s.category) : null,
          eyebrow: s.eyebrow,
          title: s.title,
          description: s.description,
          tag: s.tag,
          image: await ref(s.image),
          sortOrder: i,
        })),
      ),
    );

    // Testimonials
    await tx.insert(t.testimonials).values(
      await Promise.all(
        data.testimonials.map(async (x, i) => ({
          quote: x.quote,
          name: x.name,
          detail: x.detail ?? null,
          avatar: x.avatar ? await ref(x.avatar) : null,
          sortOrder: i,
        })),
      ),
    );

    // Editable sections, validated with the same schemas the admin forms use.
    const heroVideo = data.featuredVideos[3];
    const sections = {
      site: {
        name: data.siteConfig.name,
        shortName: data.siteConfig.shortName,
        tagline: data.siteConfig.tagline,
        description: data.siteConfig.description,
        whatsapp: data.siteConfig.whatsapp,
        email: data.siteConfig.email,
        phones: data.siteConfig.phones,
        address: data.siteConfig.address,
        socials: data.siteConfig.socials,
      },
      hero: {
        eyebrow: data.heroBrand.eyebrow,
        headline: data.heroBrand.headline,
        sublines: data.heroBrand.sublines,
        backgroundVideo: await videoRef(heroVideo.src, heroVideo.poster),
      },
      about: {
        ourStory: { ...data.ourStory, photo: await ref("/bookshelf-oak-maker-001.jpeg") },
        craftsmanship: data.craftsmanship,
        mission: data.mission,
        vision: data.vision,
        values: data.values,
      },
      founder: {
        title: data.ceoMessage.title,
        paragraphs: data.ceoMessage.paragraphs,
        name: data.ceoMessage.name,
        role: data.ceoMessage.role,
        company: data.ceoMessage.company,
        sign: data.ceoMessage.sign,
        photo: await ref(data.ceoMessage.photo),
        portrait: await ref(data.ceoMessage.portrait),
      },
    };
    for (const [key, value] of Object.entries(sections)) {
      const parsed = settingsSchemas[key as keyof typeof settingsSchemas].parse(value);
      await tx.insert(t.settings).values({ key, value: parsed });
    }
  });

  await verify();
}

/** Compare what is in the database with lib/data.ts. */
async function verify() {
  const n = async (table: PgTable) => (await db.select({ n: count() }).from(table))[0].n;
  const media = await db.select({ kind: t.productMedia.kind }).from(t.productMedia);
  const expected = {
    categories: data.categories.length,
    shopProducts: data.products.length,
    showroomMedia: data.showroomArchiveItems.length,
    showroomVideos: data.showroomArchiveItems.filter((i) => i.type === "video").length,
    portfolio: data.portfolioProjects.length + Math.min(data.featuredVideos.length, data.portfolioProjects.length),
    heroSlides: data.heroSlides.length,
    testimonials: data.testimonials.length,
    settings: 4,
  };
  const shop = await db.select({ inShop: t.products.inShop }).from(t.products);
  const actual = {
    categories: await n(t.categories),
    shopProducts: shop.filter((p) => p.inShop).length,
    showroomMedia: media.length,
    showroomVideos: media.filter((m) => m.kind === "video").length,
    portfolio: await n(t.portfolioItems),
    heroSlides: await n(t.heroSlides),
    testimonials: await n(t.testimonials),
    settings: await n(t.settings),
  };
  console.log("\nCheck            expected  actual");
  let ok = true;
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    const match = expected[key] === actual[key];
    ok &&= match;
    console.log(`${key.padEnd(16)} ${String(expected[key]).padStart(8)}  ${String(actual[key]).padStart(6)} ${match ? "ok" : "MISMATCH"}`);
  }
  console.log(`\nProducts in total (shop + showroom-only): ${shop.length}`);
  console.log(`Files in Cloudinary used by this seed: ${uploaded.size}`);
  if (!ok) {
    process.exitCode = 1;
    console.error("\nSome counts do not match. Review before using the database.");
  } else {
    console.log("\nAll counts match lib/data.ts.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
