import type {
  AppSettings,
  Attempt,
  ChildProfile,
  ProgressExport,
  RewardState,
  SessionRecord,
  SkillState,
} from "../core/types/domain";

export interface AttemptQuery {
  sessionId?: string;
  limit?: number;
}

export interface ProgressRepository {
  getProfile(): Promise<ChildProfile>;
  saveProfile(profile: ChildProfile): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  getSkillStates(): Promise<SkillState[]>;
  putSkillStates(states: SkillState[]): Promise<void>;
  addAttempt(attempt: Attempt): Promise<void>;
  listAttempts(query?: AttemptQuery): Promise<Attempt[]>;
  saveSession(session: SessionRecord): Promise<void>;
  listSessions(): Promise<SessionRecord[]>;
  getRewards(): Promise<RewardState>;
  saveRewards(rewards: RewardState): Promise<void>;
  resetProgress(): Promise<void>;
  exportAll(): Promise<ProgressExport>;
  importAll(data: ProgressExport): Promise<void>;
}

export const defaultSettings: AppSettings = {
  reducedMotion: false,
  dailyTargetMin: 10,
  showStreak: true,
  showStars: true,
  locale: "vi-VN",
};

export const defaultRewards: RewardState = {
  totalStars: 0,
  currentStreak: 0,
  bestStreak: 0,
};
