/**
 * A small external store for the enquiry list, persisted in localStorage.
 * Used through useSyncExternalStore so it is hydration-safe:
 * the server and first client render both see an empty list.
 */

export type EnquiryItem = {
  id: string;
  name: string;
  image: string;
  category?: string;
};

const STORAGE_KEY = "tm-enquiry-list";
const EMPTY: EnquiryItem[] = [];

let items: EnquiryItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed;
    }
  } catch {
    // ignore corrupted or blocked storage
  }
}

function commit(next: EnquiryItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage may be unavailable (private mode); the list still works in memory
  }
  listeners.forEach((listener) => listener());
}

export const enquiryStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): EnquiryItem[] {
    load();
    return items;
  },
  getServerSnapshot(): EnquiryItem[] {
    return EMPTY;
  },
  add(item: EnquiryItem) {
    load();
    if (items.some((i) => i.id === item.id)) return;
    commit([...items, item]);
  },
  remove(id: string) {
    load();
    commit(items.filter((i) => i.id !== id));
  },
  clear() {
    commit(EMPTY);
  },
};