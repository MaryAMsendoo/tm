/**
 * Shapes of the editable site sections stored in the `settings` table.
 * Shared by the admin forms (validation) and the public pages (types).
 */
import { z } from "zod";

export const mediaRefSchema = z.object({
  kind: z.enum(["image", "video"]),
  publicId: z.string().min(1),
  url: z.url(),
  posterUrl: z.url().nullish(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
});

export const socialKeys = ["facebook", "instagram", "tiktok", "x", "linkedin", "youtube"] as const;
export type SocialKey = (typeof socialKeys)[number];

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1, "Required");

/** Business details used across the site (header, footer, contact page, WhatsApp links). */
export const siteSettingsSchema = z.object({
  name: required(120),
  shortName: required(60),
  tagline: text(200),
  description: text(400),
  /** International format, e.g. +2349168549455. Used for every WhatsApp link. */
  whatsapp: z.string().trim().regex(/^\+?\d[\d\s-]{6,20}$/, "Use a full phone number, e.g. +2349168549455"),
  email: z.email().or(z.literal("")),
  phones: z.array(z.string().trim().regex(/^\+?\d[\d\s-]{6,20}$/, "Invalid phone number")).max(5),
  address: text(300),
  socials: z.array(
    z.object({
      key: z.enum(socialKeys),
      label: required(40),
      href: z.url().or(z.literal("")),
    }),
  ),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** Home page hero: brand text and the background video. */
export const heroSettingsSchema = z.object({
  eyebrow: text(120),
  headline: required(120),
  sublines: z.array(required(120)).max(4),
  backgroundVideo: mediaRefSchema.nullable(),
});
export type HeroSettings = z.infer<typeof heroSettingsSchema>;

/** About page text. */
export const aboutSettingsSchema = z.object({
  ourStory: z.object({
    lede: text(1000),
    paragraphs: z.array(required(3000)).max(12),
    philosophy: text(500),
    closing: text(500),
    motto: text(200),
    /** Photo beside "Our story". */
    photo: mediaRefSchema.nullable(),
  }),
  craftsmanship: z.object({
    title: required(120),
    intro: text(1000),
    points: z.array(z.object({ title: required(120), text: required(1000) })).max(12),
  }),
  mission: text(1000),
  vision: text(1000),
  values: z.array(required(80)).max(20),
});
export type AboutSettings = z.infer<typeof aboutSettingsSchema>;

/** About page: founder and CEO message. */
export const founderSettingsSchema = z.object({
  title: required(120),
  paragraphs: z.array(required(3000)).max(12),
  name: required(120),
  role: text(120),
  company: text(120),
  sign: text(120),
  photo: mediaRefSchema.nullable(),
  portrait: mediaRefSchema.nullable(),
});
export type FounderSettings = z.infer<typeof founderSettingsSchema>;

export const settingsSchemas = {
  site: siteSettingsSchema,
  hero: heroSettingsSchema,
  about: aboutSettingsSchema,
  founder: founderSettingsSchema,
} as const;
export type SettingsKey = keyof typeof settingsSchemas;
export type SettingsValue<K extends SettingsKey> = z.infer<(typeof settingsSchemas)[K]>;
