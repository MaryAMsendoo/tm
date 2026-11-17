"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * The current year, read only in the browser. Prerendering must not read the
 * clock (the page is built once and cached), so the server renders nothing
 * here and the browser fills the year in on hydration.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
