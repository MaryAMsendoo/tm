"use client";

import { useActionState } from "react";
import { cardClass, inputClass, labelTextClass } from "@/components/admin/styles";
import { Notice, SubmitButton, Toggle } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/server/admin";

export type ProductFormValues = {
  name: string;
  categoryId: number | null;
  description: string;
  dimensions: string;
  materials: string;
  customisable: boolean;
  featured: boolean;
  inShop: boolean;
  visible: boolean;
};

export function ProductForm({
  action: serverAction,
  categories,
  values,
  submitLabel,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  categories: { id: number; label: string }[];
  values: ProductFormValues;
  submitLabel: string;
}) {
  const [state, action] = useActionState<ActionResult, FormData>(serverAction, {});

  return (
    <form action={action} className={`${cardClass} space-y-5 p-5`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelTextClass}>Name</span>
          <input name="name" defaultValue={values.name} required maxLength={120} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelTextClass}>Category</span>
          <select name="categoryId" defaultValue={values.categoryId ?? ""} required className={inputClass}>
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelTextClass}>Description</span>
        <textarea name="description" defaultValue={values.description} rows={4} maxLength={2000} className={inputClass} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelTextClass}>Size (optional)</span>
          <input name="dimensions" defaultValue={values.dimensions} maxLength={200} placeholder="e.g. 2.4m wide x 2.6m high" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelTextClass}>Materials (optional)</span>
          <input name="materials" defaultValue={values.materials} maxLength={200} placeholder="e.g. HDF board, gloss finish" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Toggle name="visible" defaultChecked={values.visible} label="Visible on the website" hint="Untick to hide it everywhere without deleting it." />
        <Toggle name="inShop" defaultChecked={values.inShop} label="Listed in the shop" hint="Shown as a card in the shop grid. Its photos appear in the showroom either way." />
        <Toggle name="featured" defaultChecked={values.featured} label="Featured" hint="Shown in “Featured collections” on the home page." />
        <Toggle name="customisable" defaultChecked={values.customisable} label="Can be customised" />
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Notice state={state} />
      </div>
    </form>
  );
}
