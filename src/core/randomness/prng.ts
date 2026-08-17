export interface SeededRandom {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
}

function nextState(state: number): number {
  let value = state + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return value ^ (value >>> 14);
}

export function createSeededRandom(seed: number): SeededRandom {
  if (!Number.isInteger(seed)) {
    throw new Error("Seed must be an integer.");
  }

  let state = seed >>> 0;

  function next(): number {
    state = nextState(state);
    return (state >>> 0) / 4294967296;
  }

  return {
    next,
    int(min: number, max: number): number {
      if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
        throw new Error("Integer range is invalid.");
      }

      return min + Math.floor(next() * (max - min + 1));
    },
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty list.");
      }

      return items[Math.floor(next() * items.length)]!;
    },
    shuffle<T>(items: readonly T[]): T[] {
      const shuffled = [...items];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(next() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [
          shuffled[swapIndex]!,
          shuffled[index]!,
        ];
      }

      return shuffled;
    },
  };
}
