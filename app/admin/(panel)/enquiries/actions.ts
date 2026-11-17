"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import type { ActionResult } from "@/lib/server/admin";

const statusSchema = z.enum(["new", "contacted", "closed"]);

export async function setEnquiryStatus(id: number, status: string) {
  await requireAdmin();
  const parsed = statusSchema.parse(status);
  await db.update(enquiries).set({ status: parsed }).where(eq(enquiries.id, id));
  revalidatePath("/admin", "layout");
}

export async function saveEnquiryNotes(id: number, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await db.update(enquiries).set({ notes }).where(eq(enquiries.id, id));
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true, message: "Notes saved." };
}

export async function deleteEnquiry(id: number) {
  await requireAdmin();
  await db.delete(enquiries).where(eq(enquiries.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries");
}
