import { describe, expect, it } from "vitest";
import {
  moduleBCurriculum,
  numberBondPairSkillId,
} from "../src/core/curriculum/module-b";

describe("Module B curriculum", () => {
  it("defines all number bonds from five through ten", () => {
    expect(
      moduleBCurriculum.skills
        .filter((skill) => /^B\.bond\.\d+$/.test(skill.id))
        .map((skill) => skill.id),
    ).toEqual([
      "B.bond.5",
      "B.bond.6",
      "B.bond.7",
      "B.bond.8",
      "B.bond.9",
      "B.bond.10",
    ]);
  });

  it("tracks pairs independent of operand order", () => {
    expect(numberBondPairSkillId(8, 3, 5)).toBe("B.bond-pair.8.3-5");
    expect(numberBondPairSkillId(8, 5, 3)).toBe("B.bond-pair.8.3-5");
  });

  it("rejects inconsistent number bonds", () => {
    expect(() => numberBondPairSkillId(8, 3, 4)).toThrow();
    expect(() => numberBondPairSkillId(8, 3.5, 4.5)).toThrow();
  });
});
