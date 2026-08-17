import { describe, expect, it } from "vitest";
import { hashForRoute, routeFromHash } from "../src/app/navigation/routes";

describe("hash routes", () => {
  it("maps known routes in both directions", () => {
    expect(routeFromHash("#/parent/dashboard")).toBe("parent-dashboard");
    expect(hashForRoute("session")).toBe("#/session");
  });

  it("returns home for unknown paths", () => {
    expect(routeFromHash("#/not-a-route")).toBe("home");
  });
});
