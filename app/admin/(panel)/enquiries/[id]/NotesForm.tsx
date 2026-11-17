"use client";

import { useActionState } from "react";
import { inputClass } from "@/components/admin/styles";
import { Notice, SubmitButton } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/server/admin";
import { saveEnquiryNotes } from "../actions";

export function NotesForm({ id, notes }: { id: number; notes: string }) {
  const [state, action] = useActionState<ActionResult, FormData>(saveEnquiryNotes.bind(null, id), {});
  return (
    <form action={action} className="mt-3 space-y-3">
      <textarea name="notes" defaultValue={notes} rows={4} maxLength={5000} className={inputClass} />
      <div className="flex items-center gap-4">
        <SubmitButton>Save notes</SubmitButton>
        <Notice state={state} />
      </div>
    </form>
  );
}
