/**
 * Database structure (Neon Postgres, via Drizzle).
 *
 * After changing this file run `npm run db:generate` to create a migration,
 * then `npm run db:migrate` to apply it.
 */
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** A photo or video stored in Cloudinary. */
export type MediaRef = {
  kind: "image" | "video";
  publicId: string;
  url: string;
  /** Still frame for videos. */
  posterUrl?: string | null;
  width?: number | null;
  height?: number | null;
};

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const mediaKind = pgEnum("media_kind", ["image", "video"]);

// ---------------------------------------------------------------- catalogue

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    description: text("description").notNull().default(""),
    dimensions: text("dimensions"),
    materials: text("materials"),
    customisable: boolean("customisable").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    /** Listed as a card in the shop grid. Its media shows in the showroom either way. */
    inShop: boolean("in_shop").notNull().default(true),
    visible: boolean("visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
);

export const productMedia = pgTable(
  "product_media",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    kind: mediaKind("kind").notNull(),
    publicId: text("public_id").notNull(),
    url: text("url").notNull(),
    posterUrl: text("poster_url"),
    width: integer("width"),
    height: integer("height"),
    /** Optional caption for this photo in the showroom; falls back to the product name. */
    title: text("title"),
    /** Optional text for this photo in the showroom; falls back to the product description. */
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("product_media_product_idx").on(t.productId)],
);

// ------------------------------------------------------------ site content

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  location: text("location"),
  media: jsonb("media").$type<MediaRef>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  tag: text("tag").notNull().default(""),
  image: jsonb("image").$type<MediaRef>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  detail: text("detail"),
  avatar: jsonb("avatar").$type<MediaRef>(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

/**
 * Editable page content stored as JSON documents, one row per section
 * ("site", "hero", "about", "founder"). Each value is validated with the
 * matching Zod schema in lib/content-schemas.ts before it is saved.
 */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// --------------------------------------------------------------- enquiries

export const enquiryChannel = pgEnum("enquiry_channel", ["whatsapp", "email"]);
export const enquiryKind = pgEnum("enquiry_kind", ["quote_list", "single_item", "custom", "general"]);
export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "closed"]);

export type EnquiryItemSnapshot = {
  id: string;
  name: string;
  category?: string;
  image?: string;
};

export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    channel: enquiryChannel("channel").notNull(),
    kind: enquiryKind("kind").notNull(),
    items: jsonb("items").$type<EnquiryItemSnapshot[]>().notNull().default([]),
    /** The message text the visitor sent (what opened in WhatsApp or email). */
    message: text("message").notNull().default(""),
    status: enquiryStatus("status").notNull().default("new"),
    /** Private admin notes. */
    notes: text("notes").notNull().default(""),
    ...timestamps,
  },
  (t) => [index("enquiries_status_created_idx").on(t.status, t.createdAt)],
);

// ------------------------------------------------------------------- admin

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  /** Stored lower-case. */
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

export const adminSessions = pgTable(
  "admin_sessions",
  {
    /** SHA-256 of the cookie token; the raw token is never stored. */
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId)],
);

/** Simple sliding-window rate limiting (login attempts, enquiry spam). */
export const rateLimitEvents = pgTable(
  "rate_limit_events",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_limit_key_created_idx").on(t.key, t.createdAt)],
);
