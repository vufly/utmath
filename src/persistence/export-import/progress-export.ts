import type { ProgressExport } from "../../core/types/domain";

export const PROGRESS_EXPORT_FORMAT = "grade1-math-progress";
export const PROGRESS_EXPORT_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateProgressExport(value: unknown): ProgressExport {
  if (!isRecord(value))
    throw new Error("Progress import must be a JSON object.");
  if (value.format !== PROGRESS_EXPORT_FORMAT)
    throw new Error("Unsupported progress export format.");
  if (!Number.isInteger(value.version))
    throw new Error("Progress export version is invalid.");
  if (!Number.isFinite(value.exportedAt))
    throw new Error("Progress export timestamp is invalid.");
  if (!isRecord(value.profile) || value.profile.id !== "primary")
    throw new Error("Progress export profile is invalid.");
  if (!isRecord(value.settings))
    throw new Error("Progress export settings are invalid.");
  if (!Array.isArray(value.skillStates))
    throw new Error("Progress export skill states are invalid.");
  if (!Array.isArray(value.sessions))
    throw new Error("Progress export sessions are invalid.");
  if (!Array.isArray(value.attempts))
    throw new Error("Progress export attempts are invalid.");
  if (!isRecord(value.rewards))
    throw new Error("Progress export rewards are invalid.");

  return value as unknown as ProgressExport;
}

export function migrateProgressExport(value: unknown): ProgressExport {
  const progress = validateProgressExport(value);

  if (progress.version !== PROGRESS_EXPORT_VERSION) {
    throw new Error(
      `Progress export version ${progress.version} is not supported.`,
    );
  }

  return progress;
}
