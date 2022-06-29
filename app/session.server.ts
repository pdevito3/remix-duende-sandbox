import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or "@remix-run/cloudflare"
import type { KeycloakProfile } from "./utils/keycloak-strategy";

// if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    // name: "__Host-remix-session",
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    // secrets: [process.env.SESSION_SECRET],
    secrets: ["secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession(profile: KeycloakProfile, redirectTo: string) {
  const session = await sessionStorage.getSession();

  console.log("creating user session");
  console.log(`profile.id is ${profile.id}`);

  session.set("userId", profile.id);
  session.set("displayName", profile.displayName);
  session.set("profile", profile);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUserDisplayName(request: Request) {
  const session = await getUserSession(request);
  const displayName = session.get("displayName");
  if (!displayName || typeof displayName !== "string") return null;
  return displayName;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
}

export let { getSession, commitSession, destroySession } = sessionStorage;