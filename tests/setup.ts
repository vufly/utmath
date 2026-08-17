import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/svelte";
import { webcrypto } from "node:crypto";
import { afterEach } from "vitest";

Object.defineProperty(globalThis, "crypto", { value: webcrypto });

afterEach(cleanup);
