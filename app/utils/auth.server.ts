import { Authenticator } from "remix-auth";
import { createUserSession, sessionStorage } from "~/session.server";
import { KeycloakStrategy } from './keycloak-strategy';

export const authenticator = new Authenticator<any>(sessionStorage);

// if (!process.env.AUTH0_CALLBACK_URL)
//   throw new Error("AUTH0_CALLBACK_URL is not set");
// if (!process.env.AUTH0_CLIENT_ID) throw new Error("AUTH0_CLIENT_ID is not set");
// if (!process.env.AUTH0_DOMAIN) throw new Error("AUTH0_DOMAIN is not set");
// if (!process.env.AUTH0_CLIENT_SECRET)
//   throw new Error("AUTH0_CLIENT_SECRET is not set");

let keycloakStrategy = new KeycloakStrategy(
  {
    // callbackURL: process.env.AUTH0_CALLBACK_URL,
    // clientID: process.env.AUTH0_CLIENT_ID,
    // clientSecret: process.env.AUTH0_CLIENT_SECRET,
    // domain: process.env.AUTH0_DOMAIN,
    callbackURL: "http://localhost:6522/auth/callback",
    clientID: "recipe_management.remix",
    clientSecret: "TdqU6nYehzqgiko99qVpnolDls0iL0CO",
    domain: "localhost:3385/auth/realms/My%20Realm",
    scope: "recipe_management openid profile", // <- role breaks this 🤔
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.log({ accessToken, refreshToken, extraParams, profile });
    // Get the user data from your DB or API using the tokens and profile

    console.log(`displayName is ${profile.displayName}`)
    console.log(`id is ${profile.id}`)
    createUserSession(profile, "/");

    return { email: profile.emails.at(0) };
  }
);

authenticator.use(keycloakStrategy);