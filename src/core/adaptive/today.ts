import type {
  Attempt,
  ModuleId,
  ParentOverrides,
  SkillState,
} from "../types/domain";

export interface AdaptiveTodayContext {
  skillStates: SkillState[];
  recentAttempts: Attempt[];
  parentOverrides: ParentOverrides;
  slotCount?: number;
}

const defaultModules: ModuleId[] = ["A", "B"];

function moduleFromSkill(skillId: string): ModuleId | undefined {
  const module = skillId.slice(0, 1);
  return ["A", "B", "C", "D", "E", "F"].includes(module)
    ? (module as ModuleId)
    : undefined;
}

export function planAdaptiveToday(context: AdaptiveTodayContext): ModuleId[] {
  const slotCount = context.slotCount ?? 16;
  const focused = context.parentOverrides.focusedSkillIds
    .map(moduleFromSkill)
    .filter((module): module is ModuleId => Boolean(module));
  const practiced = context.skillStates
    .map((state) => moduleFromSkill(state.skillId))
    .filter((module): module is ModuleId => Boolean(module));
  const modules = [
    ...new Set([...focused, ...defaultModules, ...practiced]),
  ].filter((module) => {
    const moduleStates = context.skillStates.filter((state) =>
      state.skillId.startsWith(`${module}.`),
    );
    return !moduleStates.some((state) => state.parentPaused);
  });

  if (modules.length === 0) return ["A"];

  const scores = new Map<ModuleId, number>();
  for (const module of modules) {
    const states = context.skillStates.filter((state) =>
      state.skillId.startsWith(`${module}.`),
    );
    const average =
      states.length === 0
        ? 0.25
        : states.reduce((sum, state) => sum + state.score, 0) / states.length;
    scores.set(module, average - (focused.includes(module) ? 1 : 0));
  }
  const ordered = [...modules].sort(
    (left, right) =>
      scores.get(left)! - scores.get(right)! || left.localeCompare(right),
  );
  const slots: ModuleId[] = [];

  for (let index = 0; index < slotCount; index += 1) {
    const purpose = index % 10;
    if (purpose < 5) slots.push(ordered[0]!);
    else if (purpose < 8) slots.push(ordered[(index - 5) % ordered.length]!);
    else if (purpose < 9 && ordered.length > 1) slots.push(ordered[1]!);
    else slots.push(ordered[index % ordered.length]!);
  }

  return slots;
}
