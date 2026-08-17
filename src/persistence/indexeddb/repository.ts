import type {
  AppSettings,
  Attempt,
  ChildProfile,
  ProgressExport,
  RewardState,
  SessionRecord,
  SkillState,
} from "../../core/types/domain";
import {
  migrateProgressExport,
  PROGRESS_EXPORT_FORMAT,
  PROGRESS_EXPORT_VERSION,
} from "../export-import/progress-export";
import {
  defaultRewards,
  defaultSettings,
  type AttemptQuery,
  type ProgressRepository,
} from "../repository";
import {
  DATABASE_VERSION,
  openDatabase,
  requestToPromise,
  storeNames,
  transactionToPromise,
  type StoredMetadata,
  type StoredRewards,
  type StoredSettings,
} from "./database";

interface RepositoryOptions {
  factory: IDBFactory;
  now?: () => number;
}

export class IndexedDbProgressRepository implements ProgressRepository {
  private readonly database: Promise<IDBDatabase>;
  private readonly now: () => number;

  private constructor(options: RepositoryOptions) {
    this.database = openDatabase(options.factory);
    this.now = options.now ?? Date.now;
  }

  static async create(
    options: RepositoryOptions,
  ): Promise<IndexedDbProgressRepository> {
    const repository = new IndexedDbProgressRepository(options);
    await repository.initialize();
    return repository;
  }

  async getProfile(): Promise<ChildProfile> {
    return this.getByKey<ChildProfile>(storeNames.profile, "primary");
  }

  async saveProfile(profile: ChildProfile): Promise<void> {
    await this.put(storeNames.profile, profile);
  }

  async getSettings(): Promise<AppSettings> {
    return (await this.getByKey<StoredSettings>(storeNames.settings, "primary"))
      .data as AppSettings;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await this.put(storeNames.settings, {
      id: "primary",
      data: settings,
    } satisfies StoredSettings);
  }

  async getSkillStates(): Promise<SkillState[]> {
    return this.getAll<SkillState>(storeNames.skills);
  }

  async putSkillStates(states: SkillState[]): Promise<void> {
    const database = await this.database;
    const transaction = database.transaction(storeNames.skills, "readwrite");
    const store = transaction.objectStore(storeNames.skills);
    store.clear();
    states.forEach((state) => store.put(state));
    await transactionToPromise(transaction);
  }

  async addAttempt(attempt: Attempt): Promise<void> {
    await this.put(storeNames.attempts, attempt);
  }

  async listAttempts(query: AttemptQuery = {}): Promise<Attempt[]> {
    const database = await this.database;
    const transaction = database.transaction(storeNames.attempts, "readonly");
    const store = transaction.objectStore(storeNames.attempts);
    const attempts = query.sessionId
      ? await requestToPromise(store.index("sessionId").getAll(query.sessionId))
      : await requestToPromise(store.getAll());
    await transactionToPromise(transaction);

    const sorted = (attempts as Attempt[]).sort(
      (left, right) => right.completedAt - left.completedAt,
    );
    return query.limit === undefined ? sorted : sorted.slice(0, query.limit);
  }

  async saveSession(session: SessionRecord): Promise<void> {
    await this.put(storeNames.sessions, session);
  }

  async listSessions(): Promise<SessionRecord[]> {
    const sessions = await this.getAll<SessionRecord>(storeNames.sessions);
    return sessions.sort((left, right) => right.startedAt - left.startedAt);
  }

  async getRewards(): Promise<RewardState> {
    return (await this.getByKey<StoredRewards>(storeNames.rewards, "primary"))
      .data as RewardState;
  }

  async saveRewards(rewards: RewardState): Promise<void> {
    await this.put(storeNames.rewards, {
      id: "primary",
      data: rewards,
    } satisfies StoredRewards);
  }

  async exportAll(): Promise<ProgressExport> {
    const [profile, settings, skillStates, sessions, attempts, rewards] =
      await Promise.all([
        this.getProfile(),
        this.getSettings(),
        this.getSkillStates(),
        this.listSessions(),
        this.listAttempts(),
        this.getRewards(),
      ]);

    return {
      format: PROGRESS_EXPORT_FORMAT,
      version: PROGRESS_EXPORT_VERSION,
      exportedAt: this.now(),
      profile,
      settings,
      skillStates,
      sessions,
      attempts,
      rewards,
    };
  }

  async importAll(input: ProgressExport): Promise<void> {
    const data = migrateProgressExport(input);
    const database = await this.database;
    const transaction = database.transaction(
      [
        storeNames.profile,
        storeNames.settings,
        storeNames.skills,
        storeNames.attempts,
        storeNames.sessions,
        storeNames.rewards,
      ],
      "readwrite",
    );

    transaction.objectStore(storeNames.profile).put(data.profile);
    transaction
      .objectStore(storeNames.settings)
      .put({ id: "primary", data: data.settings } satisfies StoredSettings);
    transaction
      .objectStore(storeNames.rewards)
      .put({ id: "primary", data: data.rewards } satisfies StoredRewards);
    this.replaceStore(
      transaction.objectStore(storeNames.skills),
      data.skillStates,
    );
    this.replaceStore(
      transaction.objectStore(storeNames.attempts),
      data.attempts,
    );
    this.replaceStore(
      transaction.objectStore(storeNames.sessions),
      data.sessions,
    );

    await transactionToPromise(transaction);
  }

  private async initialize(): Promise<void> {
    const database = await this.database;
    const [profile, settings, rewards, metadata] = await Promise.all([
      this.getOptional<ChildProfile>(storeNames.profile, "primary"),
      this.getOptional<StoredSettings>(storeNames.settings, "primary"),
      this.getOptional<StoredRewards>(storeNames.rewards, "primary"),
      this.getOptional<StoredMetadata>(storeNames.metadata, "app"),
    ]);
    const transaction = database.transaction(
      [
        storeNames.profile,
        storeNames.settings,
        storeNames.rewards,
        storeNames.metadata,
      ],
      "readwrite",
    );
    const timestamp = this.now();
    const profileStore = transaction.objectStore(storeNames.profile);
    const settingsStore = transaction.objectStore(storeNames.settings);
    const rewardsStore = transaction.objectStore(storeNames.rewards);
    const metadataStore = transaction.objectStore(storeNames.metadata);

    if (!profile) {
      profileStore.put({
        id: "primary",
        displayName: "Uyển Thanh",
        createdAt: timestamp,
      } satisfies ChildProfile);
    }
    if (!settings) {
      settingsStore.put({
        id: "primary",
        data: defaultSettings,
      } satisfies StoredSettings);
    }
    if (!rewards) {
      rewardsStore.put({
        id: "primary",
        data: defaultRewards,
      } satisfies StoredRewards);
    }
    metadataStore.put({
      id: "app",
      schemaVersion: DATABASE_VERSION,
      createdAt: metadata?.createdAt ?? timestamp,
      lastOpenedAt: timestamp,
    } satisfies StoredMetadata);

    await transactionToPromise(transaction);
  }

  private async getByKey<T>(storeName: string, key: IDBValidKey): Promise<T> {
    const value = await this.getOptional<T>(storeName, key);

    if (value === undefined)
      throw new Error(`Missing required ${storeName} record.`);
    return value;
  }

  private async getOptional<T>(
    storeName: string,
    key: IDBValidKey,
  ): Promise<T | undefined> {
    const database = await this.database;
    const transaction = database.transaction(storeName, "readonly");
    const value = await requestToPromise<T | undefined>(
      transaction.objectStore(storeName).get(key),
    );
    await transactionToPromise(transaction);

    return value;
  }

  private async getAll<T>(storeName: string): Promise<T[]> {
    const database = await this.database;
    const transaction = database.transaction(storeName, "readonly");
    const values = await requestToPromise<T[]>(
      transaction.objectStore(storeName).getAll(),
    );
    await transactionToPromise(transaction);
    return values;
  }

  private async put(storeName: string, value: unknown): Promise<void> {
    const database = await this.database;
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    await transactionToPromise(transaction);
  }

  private replaceStore(store: IDBObjectStore, values: unknown[]): void {
    store.clear();
    values.forEach((value) => store.put(value));
  }
}
