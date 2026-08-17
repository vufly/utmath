import { describe, expect, it } from "vitest";
import { createSeededRandom } from "../src/core/randomness/prng";

describe("seeded randomness", () => {
  it("replays same sequence for same seed", () => {
    const first = createSeededRandom(12345);
    const second = createSeededRandom(12345);

    expect([
      first.next(),
      first.int(0, 10),
      first.pick(["a", "b", "c"]),
    ]).toEqual([
      second.next(),
      second.int(0, 10),
      second.pick(["a", "b", "c"]),
    ]);
  });

  it("keeps integer results inside inclusive bounds", () => {
    const random = createSeededRandom(7);

    for (let index = 0; index < 1000; index += 1) {
      expect(random.int(2, 8)).toBeGreaterThanOrEqual(2);
      expect(random.int(2, 8)).toBeLessThanOrEqual(8);
    }
  });

  it("rejects invalid generator inputs", () => {
    expect(() => createSeededRandom(1.5)).toThrow("Seed must be an integer.");
    expect(() => createSeededRandom(1).int(5, 4)).toThrow(
      "Integer range is invalid.",
    );
    expect(() => createSeededRandom(1).pick([])).toThrow(
      "Cannot pick from an empty list.",
    );
  });
});
