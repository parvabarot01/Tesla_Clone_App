const STORAGE_PREFIX = "tesla-clone";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function safeLocalStorageGet<T>(key: string) {
  if (!canUseLocalStorage()) {
    return null as T | null;
  }

  try {
    const value = window.localStorage.getItem(key);

    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null as T | null;
  }
}

export function safeLocalStorageSet(key: string, value: unknown) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function safeLocalStorageRemove(key: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {}
}

export function getBuildStorageKey(slug: string) {
  return `${STORAGE_PREFIX}:build:${slug}`;
}

export function getDemoDriveStorageKey(slug: string) {
  return `${STORAGE_PREFIX}:demo-drive:${slug}`;
}
