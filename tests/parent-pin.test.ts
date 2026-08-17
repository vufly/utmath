import { describe, expect, it } from "vitest";
import {
  digestParentPin,
  isValidParentPin,
  verifyParentPin,
} from "../src/app/state/parent-pin";

describe("parent PIN", () => {
  it("only accepts exactly four digits", () => {
    expect(isValidParentPin("2580")).toBe(true);
    expect(isValidParentPin("258")).toBe(false);
    expect(isValidParentPin("abcd")).toBe(false);
  });

  it("verifies a digest without retaining plaintext", async () => {
    const digest = await digestParentPin("2580");

    await expect(verifyParentPin("2580", digest)).resolves.toBe(true);
    await expect(verifyParentPin("0000", digest)).resolves.toBe(false);
  });
});
