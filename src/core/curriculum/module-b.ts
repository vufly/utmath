import type { CurriculumDefinition, SkillDefinition } from "../types/domain";

const bondWholes = [5, 6, 7, 8, 9, 10] as const;

function bondSkill(whole: number): SkillDefinition {
  return {
    id: `B.bond.${whole}`,
    module: "B",
    prerequisites: whole === 5 ? [] : [`B.bond.${whole - 1}`],
    exerciseGenerators: ["number-bond-part-whole"],
    reviewAfterDays: [2, 5, 12],
  };
}

export function numberBondPairSkillId(
  whole: number,
  partA: number,
  partB: number,
): string {
  if (
    !Number.isInteger(whole) ||
    !Number.isInteger(partA) ||
    !Number.isInteger(partB) ||
    whole < 0 ||
    whole > 10 ||
    partA + partB !== whole ||
    partA < 0 ||
    partB < 0
  ) {
    throw new Error(
      "Number bond parts must be non-negative and total the whole.",
    );
  }

  const [smaller, larger] = [partA, partB].sort((left, right) => left - right);
  return `B.bond-pair.${whole}.${smaller}-${larger}`;
}

export const moduleBSkillDefinitions: SkillDefinition[] = [
  ...bondWholes.map(bondSkill),
  {
    id: "B.part-whole.missing-part",
    module: "B",
    prerequisites: ["B.bond.5"],
    exerciseGenerators: ["number-bond-part-whole"],
    reviewAfterDays: [2, 5, 12],
  },
  {
    id: "B.part-whole.missing-whole",
    module: "B",
    prerequisites: ["B.bond.5"],
    exerciseGenerators: ["number-bond-part-whole"],
    reviewAfterDays: [2, 5, 12],
  },
  {
    id: "B.make5",
    module: "B",
    prerequisites: ["B.bond.5"],
    exerciseGenerators: ["number-bond-make5"],
    reviewAfterDays: [2, 5, 12],
  },
  {
    id: "B.make10",
    module: "B",
    prerequisites: ["B.bond.10"],
    exerciseGenerators: ["number-bond-make10"],
    reviewAfterDays: [2, 5, 12],
  },
  {
    id: "B.fact-family",
    module: "B",
    prerequisites: ["B.part-whole.missing-part"],
    exerciseGenerators: ["number-bond-fact-family"],
    reviewAfterDays: [3, 7, 14],
  },
];

export const moduleBCurriculum: CurriculumDefinition = {
  skills: moduleBSkillDefinitions,
};
