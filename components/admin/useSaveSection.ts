"use client";

import { useState, useTransition } from "react";
import type { SettingsKey, SettingsValue } from "@/lib/content-schemas";
import { saveSettings } from "@/app/admin/(panel)/content-actions";

type Result = { ok?: boolean; error?: string; message?: string };

/** Local state for one editable section, saved as a whole with saveSettings(). */
export function useSaveSection<K extends SettingsKey>(key: K, initial: SettingsValue<K>) {
  const [value, setValue] = useState(initial);
  const [result, setResult] = useState<Result>({});
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      setResult({});
      setResult(await saveSettings(key, value));
    });

  const update = (patch: Partial<SettingsValue<K>>) => setValue((v) => ({ ...v, ...patch }));

  return { value, setValue, update, save, pending, result };
}

/** Text area <-> list helpers. */
export const toLines = (list: string[]) => list.join("\n");
export const fromLines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);
export const toParagraphs = (list: string[]) => list.join("\n\n");
export const fromParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
