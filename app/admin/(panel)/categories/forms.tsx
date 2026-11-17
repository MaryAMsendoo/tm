"use client";

import { useActionState } from "react";
import { cardClass, inputClass } from "@/components/admin/styles";
import { Notice, SubmitButton } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/server/admin";
import { createCategory, updateCategory } from "./actions";

export function NewCategoryForm() {
  const [state, action] = useActionState<ActionResult, FormData>(createCategory, {});
  return (
    <form action={action} className={`${cardClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
      <label className="flex-1">
        <span className="sr-only">New category name</span>
        <input name="label" placeholder="New category, e.g. Bathroom" required maxLength={60} className={inputClass} />
      </label>
      <SubmitButton>Add category</SubmitButton>
      <Notice state={state} />
    </form>
  );
}

export function CategoryForm({ id, label, visible }: { id: number; label: string; visible: boolean }) {
  const [state, action] = useActionState<ActionResult, FormData>(updateCategory.bind(null, id), {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <label className="min-w-48 flex-1">
        <span className="sr-only">Name</span>
        <input name="label" defaultValue={label} required maxLength={60} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 text-sm text-(--text-muted)">
        <input type="checkbox" name="visible" defaultChecked={visible} className="h-4 w-4 accent-(--brand-wood)" />
        Visible
      </label>
      <SubmitButton>Save</SubmitButton>
      <Notice state={state} />
    </form>
  );
}
