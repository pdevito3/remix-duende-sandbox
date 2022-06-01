import { Authenticator } from "remix-auth";
import { DuendeStrategy } from "./duende-strategy";
import { sessionStorage } from "~/session.server";

export const authenticator = new Authenticator<any>(sessionStorage);

// if (!process.env.AUTH0_CALLBACK_URL)
//   throw new Error("AUTH0_CALLBACK_URL is not set");
// if (!process.env.AUTH0_CLIENT_ID) throw new Error("AUTH0_CLIENT_ID is not set");
// if (!process.env.AUTH0_DOMAIN) throw new Error("AUTH0_DOMAIN is not set");
// if (!process.env.AUTH0_CLIENT_SECRET)
//   throw new Error("AUTH0_CLIENT_SECRET is not set");

let duendeStrategy = new DuendeStrategy(
  {
    // callbackURL: process.env.AUTH0_CALLBACK_URL,
    // clientID: process.env.AUTH0_CLIENT_ID,
    // clientSecret: process.env.AUTH0_CLIENT_SECRET,
    // domain: process.env.AUTH0_DOMAIN,
    callbackURL: "http://localhost:6522/auth/callback",
    clientID: "recipe_management.remix",
    clientSecret: "secret",
    domain: "localhost:3385",
    codeChallenge: "NxYpCwEgyKDk5bmzIj2Pz-5YtmybegRpEZmoqtEEY4E",
    codeChallengeMethod: "S256",
    scope: "recipe_management openid profile", // <- role breaks this
    responseType: "code",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.log({ accessToken, refreshToken, extraParams, profile });
    // Get the user data from your DB or API using the tokens and profile
    return { email: profile.emails.at(0) };
  }
);

authenticator.use(duendeStrategy);