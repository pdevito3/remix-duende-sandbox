import { createCookieSessionStorage } from "@remix-run/node"; // or "@remix-run/cloudflare"

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

export let { getSession, commitSession, destroySession } = sessionStorage;