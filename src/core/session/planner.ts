import type {
  ExerciseSlot,
  PlannedSession,
  SessionPlanningContext,
  SkillDefinition,
  SkillState,
} from "../types/domain";

const defaultSlotPurposes: ExerciseSlot["purpose"][] = [
  "learn",
  "learn",
  "learn",
  "learn",
  "learn",
  "learn",
  "learn",
  "learn",
  "review",
  "review",
  "review",
  "review",
  "review",
  "remediate",
  "remediate",
  "challenge",
];

function stateFor(
  skill: SkillDefinition,
  states: Map<string, SkillState>,
): SkillState {
  return (
    states.get(skill.id) ?? {
      skillId: skill.id,
      stage: "new",
      score: 0,
      totalAttempts: 0,
      recentCorrect: 0,
      recentIndependentCorrect: 0,
    }
  );
}

function prerequisitesMet(
  skill: SkillDefinition,
  states: Map<string, SkillState>,
  unlocked: Set<string>,
): boolean {
  return (
    unlocked.has(skill.id) ||
    skill.prerequisites.every((id) => states.get(id)?.stage === "stable")
  );
}

export function planInitialSession(
  context: SessionPlanningContext,
): PlannedSession {
  const states = new Map(
    context.skillStates.map((state) => [state.skillId, state]),
  );
  const focused = new Set(context.parentOverrides.focusedSkillIds);
  const paused = new Set(context.parentOverrides.pausedSkillIds);
  const unlocked = new Set(context.parentOverrides.manuallyUnlockedSkillIds);
  const eligible = context.curriculum.skills.filter(
    (skill) =>
      !paused.has(skill.id) && prerequisitesMet(skill, states, unlocked),
  );
  const available =
    eligible.length > 0
      ? eligible
      : context.curriculum.skills.filter((skill) => !paused.has(skill.id));

  if (available.length === 0) {
    throw new Error("Cannot plan a session without available skills.");
  }

  const ordered = [...available].sort((left, right) => {
    const focusDifference =
      Number(focused.has(right.id)) - Number(focused.has(left.id));
    if (focusDifference !== 0) return focusDifference;

    const leftState = stateFor(left, states);
    const rightState = stateFor(right, states);
    return (
      leftState.score - rightState.score || left.id.localeCompare(right.id)
    );
  });

  const slots = defaultSlotPurposes.map((purpose, index) => {
    const skill = ordered[index % ordered.length]!;
    const preferredRepresentations: ExerciseSlot["preferredRepresentations"] =
      index % 2 === 0 ? ["part-whole"] : ["dots"];

    return {
      purpose,
      preferredSkillIds: [skill.id],
      preferredRepresentations,
    };
  });

  return {
    id: `today-${context.now}`,
    targetDurationMin: 10,
    slots,
  };
}
