// We need to import from Remix Auth the type of the strategy verify callback
import type { StrategyVerifyCallback } from "remix-auth";
// We need to import the OAuth2Strategy, the verify params and the profile interfaces
import base64url from "base64url";
import * as crypto from "crypto";
import randomstring from "randomstring";
import type {
  OAuth2Profile,
  OAuth2StrategyVerifyParams
} from "remix-auth-oauth2";
import { OAuth2Strategy } from "remix-auth-oauth2";

// These are the custom options we need from the developer to use the strategy
export interface KeycloakStrategyOptions {
  domain: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: string;
  audience?: string;
  responseType?: string;
}

// This interface declare what extra params we will get from Keycloak on the
// verify callback
export interface KeycloakExtraParams extends Record<string, string | number> {
  id_token: string;
  scope: string;
  expires_in: 86_400;
  token_type: "Bearer";
}

// The KeycloakProfile extends the OAuth2Profile with the extra params and mark
// some of them as required
export interface KeycloakProfile extends OAuth2Profile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
    middleName: string;
  };
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    middle_name: string;
    nickname: string;
    preferred_username: string;
    profile: string;
    picture: string;
    website: string;
    email: string;
    email_verified: boolean;
    gender: string;
    birthdate: string;
    zoneinfo: string;
    locale: string;
    phone_number: string;
    phone_number_verified: boolean;
    address: {
      country: string;
    };
    updated_at: string;
  };
}

// And we create our strategy extending the OAuth2Strategy, we also need to
// pass the User as we did on the FormStrategy, we pass the KeycloakProfile and the
// extra params
export class KeycloakStrategy<User> extends OAuth2Strategy<
  User,
  KeycloakProfile,
  KeycloakExtraParams
> {
  // The OAuth2Strategy already has a name but we override it to be specific of
  // the service we are using
  name = "keycloak";

  private userInfoURL: string;
  private scope: string;
  private audience?: string;
  private codeChallenge?: string;  
  private codeChallengeMethod?: string;
  private responseType?: string;

  // We receive our custom options and our verify callback
  constructor(
    options: KeycloakStrategyOptions,
    // Here we type the verify callback as a StrategyVerifyCallback receiving
    // the User type and the OAuth2StrategyVerifyParams with the KeycloakProfile
    // and the KeycloakExtraParams
    // This way, when using the strategy the verify function will receive as
    // params an object with accessToken, refreshToken, extraParams and profile.
    // The latest two matching the types of KeycloakProfile and KeycloakExtraParams.
    verify: StrategyVerifyCallback<
      User,
      OAuth2StrategyVerifyParams<KeycloakProfile, KeycloakExtraParams>
    >
  ) {
    // And we pass the options to the super constructor using our own options
    // to generate them, this was we can ask less configuration to the developer
    // using our strategy
    super(
      {
        authorizationURL: `http://${options.domain}/protocol/openid-connect/auth`,
        tokenURL: `http://${options.domain}/protocol/openid-connect/token`,
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL,
      },
      verify
    );

    this.userInfoURL = `https://${options.domain}/protocol/openid-connect/userinfo`;
    this.scope = options.scope || "openid profile role";
    this.audience = options.audience;
    this.responseType = options.responseType;
  }

  protected getCodeChallenge() {    
    const codeVerifier = randomstring.generate(128);
    
    const base64Digest = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64");
    
    console.log(base64Digest); // +PCBxoCJMdDloUVl1ctjvA6VNbY6fTg1P7PNhymbydM=
    
    const codeChallenge = base64url.fromBase64(base64Digest);
    
    console.log(codeChallenge); // -PCBxoCJMdDloUVl1ctjvA6VNbY6fTg1P7PNhymbydM

    return codeChallenge;
  }
  
  // We override the protected authorizationParams method to return a new
  // URLSearchParams with custom params we want to send to the authorizationURL.
  // Here we add the scope so Keycloak can use it, you can pass any extra param
  // you need to send to the authorizationURL here base on your provider.
  protected authorizationParams() {
    const urlSearchParams: Record<string, string> = {
      scope: this.scope,
    };

    if (this.audience) {
      urlSearchParams.audience = this.audience;
    }    
    urlSearchParams.responseType = "code"; 

    urlSearchParams["code_challenge"] = this.getCodeChallenge();
    urlSearchParams["code_challenge_method"] = "S256"

    return new URLSearchParams(urlSearchParams);
  }

  // We also override how to use the accessToken to get the profile of the user.
  // Here we fetch a Keycloak specific URL, get the profile data, and build the
  // object based on the KeycloakProfile interface.
  protected async userProfile(accessToken: string): Promise<KeycloakProfile> {
    let response = await fetch(this.userInfoURL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let data: KeycloakProfile["_json"] = await response.json();

    let profile: KeycloakProfile = {
      provider: "keycloak",
      displayName: data.name,
      id: data.sub,
      name: {
        familyName: data.family_name,
        givenName: data.given_name,
        middleName: data.middle_name,
      },
      emails: [{ value: data.email }],
      photos: [{ value: data.picture }],
      _json: data,
    };

    return profile;
  }
}