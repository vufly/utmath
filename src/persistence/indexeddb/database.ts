import type { AppMetadata } from "./types";

export const DATABASE_NAME = "uyen-thanh-hoc-toan";
export const DATABASE_VERSION = 1;

export const storeNames = {
  profile: "profile",
  settings: "settings",
  skills: "skills",
  attempts: "attempts",
  sessions: "sessions",
  rewards: "rewards",
  curriculumState: "curriculumState",
  metadata: "metadata",
} as const;

export type StoreName = (typeof storeNames)[keyof typeof storeNames];

export interface StoredSettings {
  id: "primary";
  data: unknown;
}

export interface StoredRewards {
  id: "primary";
  data: unknown;
}

export interface StoredMetadata extends AppMetadata {
  id: "app";
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

export function transactionToPromise(
  transaction: IDBTransaction,
): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction failed."));
  });
}

export function openDatabase(factory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = factory.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(storeNames.profile)) {
        database.createObjectStore(storeNames.profile, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(storeNames.settings)) {
        database.createObjectStore(storeNames.settings, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(storeNames.skills)) {
        database.createObjectStore(storeNames.skills, { keyPath: "skillId" });
      }
      if (!database.objectStoreNames.contains(storeNames.attempts)) {
        const attempts = database.createObjectStore(storeNames.attempts, {
          keyPath: "id",
        });
        attempts.createIndex("sessionId", "sessionId", { unique: false });
        attempts.createIndex("completedAt", "completedAt", { unique: false });
      }
      if (!database.objectStoreNames.contains(storeNames.sessions)) {
        database.createObjectStore(storeNames.sessions, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(storeNames.rewards)) {
        database.createObjectStore(storeNames.rewards, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(storeNames.curriculumState)) {
        database.createObjectStore(storeNames.curriculumState, {
          keyPath: "id",
        });
      }
      if (!database.objectStoreNames.contains(storeNames.metadata)) {
        database.createObjectStore(storeNames.metadata, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open IndexedDB."));
  });
}
