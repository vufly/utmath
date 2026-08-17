export type Route =
  | "home"
  | "session"
  | "summary"
  | "parent-pin"
  | "parent-dashboard"
  | "settings"
  | "backup";

const pathToRoute: Record<string, Route> = {
  "/": "home",
  "/session": "session",
  "/summary": "summary",
  "/parent": "parent-pin",
  "/parent/dashboard": "parent-dashboard",
  "/settings": "settings",
  "/backup": "backup",
};

const routeToPath: Record<Route, string> = {
  home: "/",
  session: "/session",
  summary: "/summary",
  "parent-pin": "/parent",
  "parent-dashboard": "/parent/dashboard",
  settings: "/settings",
  backup: "/backup",
};

export function routeFromHash(hash: string): Route {
  const path = hash.replace(/^#/, "") || "/";
  return pathToRoute[path] ?? "home";
}

export function hashForRoute(route: Route): string {
  return `#${routeToPath[route]}`;
}

export function navigate(route: Route): void {
  window.location.hash = hashForRoute(route);
}
