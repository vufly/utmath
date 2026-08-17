export const DEFAULT_PARENT_PIN = "2580";

export function isValidParentPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export async function digestParentPin(pin: string): Promise<string> {
  if (!isValidParentPin(pin)) {
    throw new Error("Parent PIN must contain exactly four digits.");
  }

  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function verifyParentPin(
  pin: string,
  expectedDigest: string,
): Promise<boolean> {
  if (!isValidParentPin(pin)) {
    return false;
  }

  return (await digestParentPin(pin)) === expectedDigest;
}
