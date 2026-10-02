"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { enquiryStore, type EnquiryItem } from "../lib/enquiry-store";
import { enquiryThumbnail } from "../lib/data";

type EnquiryContextValue = {
  items: EnquiryItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: EnquiryItem) => void;
  remove: (id: string) => void;
  toggle: (item: EnquiryItem) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    enquiryStore.subscribe,
    enquiryStore.getSnapshot,
    enquiryStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const has = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const toggle = useCallback(
    (item: EnquiryItem) => {
      if (items.some((i) => i.id === item.id)) enquiryStore.remove(item.id);
      else enquiryStore.add({ ...item, image: enquiryThumbnail(item.image) });
    },
    [items],
  );

  const value = useMemo<EnquiryContextValue>(
    () => ({
      items,
      count: items.length,
      isOpen,
      open,
      close,
      add: enquiryStore.add,
      remove: enquiryStore.remove,
      toggle,
      has,
      clear: enquiryStore.clear,
    }),
    [items, isOpen, open, close, toggle, has],
  );

  return (
    <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}