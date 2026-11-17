import { z } from "zod";

/** What the browser sends when a visitor makes a request. Shared by the dialog and the API. */
export const enquiryInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
  channel: z.enum(["whatsapp", "email"]),
  kind: z.enum(["quote_list", "single_item", "custom", "general"]),
  items: z
    .array(
      z.object({
        id: z.string().max(100),
        name: z.string().max(200),
        category: z.string().max(100).optional(),
        image: z.string().max(1000).optional(),
      }),
    )
    .max(50)
    .default([]),
  message: z.string().max(5000).default(""),
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;
