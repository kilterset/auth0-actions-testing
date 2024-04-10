import Auth0, { Factor, MultifactorEnableOptions } from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";
import { ok } from "node:assert";
import { encodeHS256JWT, signHS256 } from "../../jwt/hs256";
import { accessTokenMock } from "./access-token";
import { accessMock } from "./access";
import { authenticationMock, FactorList } from "./authentication";
import { idTokenMock } from "./id-token";
import { multifactorMock } from "./multifactor";
import { redirectMock } from "./redirect";
import { userMock } from "./user";
import { samlResponseMock } from "./saml-response";

export interface PostLoginOptions {
  user?: Auth0.User;
  cache?: Record<string, string>;
  executedRules?: string[];
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
}

type SamlAttributeValue =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean>;

interface SamlResponseState {
  attributes: Record<string, SamlAttributeValue>;
  createUpnClaim: boolean;
  passthroughClaimsWithNoMapping: boolean;
  mapUnknownClaimsAsIs: boolean;
  mapIdentities: boolean;
  signResponse: boolean;
  lifetimeInSeconds: number;
  nameIdentifierFormat: string;
  nameIdentifierProbes: string[];
  authnContextClassRef: string;
  includeAttributeNameFormat: boolean;
  typedAttributes: boolean;
  audience: string;
  recipient: string;
  destination: string;
  cert?: string;
  encryptionCert?: string;
  encryptionPublicKey?: string;
  key?: string;
  signingCert?: string;
}

export interface PostLoginState {
  user: Auth0.User;
  cache: Auth0.API.Cache;
  access: { denied: false } | { denied: { reason: string } };
  accessToken: {
    claims: Record<string, unknown>;
    scopes: string[];
  };
  authentication: {
    primaryUserId: string;
    challenge: FactorList | false;
    enrollment: FactorList | false;
    newlyRecordedMethods: string[];
  };
  idToken: {
    claims: Record<string, unknown>;
  };
  multifactor: {
    enabled:
      | false
      | {
          provider: string;
          options?: MultifactorEnableOptions;
        };
  };
  samlResponse: SamlResponseState;
  validation: {
    error: { code: string; message: string } | null;
  };
  redirect: {
    target: { url: URL; queryParams: Record<string, string> } | null;
  };
}

export function postLogin({
  user,
  request,
  cache,
  executedRules: optionallyExecutedRules,
  now: nowValue,
}: PostLoginOptions = {}) {
  const userValue = user ?? mockUser();
  const executedRules = optionallyExecutedRules ?? [];
  const requestValue = request ?? mockRequest();
  const now = new Date(nowValue || Date.now());

  const apiCache = mockCache(cache);
  const access = accessMock("PostLogin");
  const accessToken = accessTokenMock("PostLogin");
  const authentication = authenticationMock("PostLogin", { userId: userValue.user_id });
  const idToken = idTokenMock("PostLogin");
  const multifactor = multifactorMock("PostLogin");
  const redirect = redirectMock("PostLogin", { now, request: requestValue, user: userValue });
  const userApiMock = userMock("PostLogin", { user: userValue });
  const samlResponse = samlResponseMock("PostLogin");

  const state: PostLoginState = {
    user: userApiMock.state,
    access: access.state,
    accessToken: accessToken.state,
    authentication: authentication.state,
    cache: apiCache,
    idToken: idToken.state,
    multifactor: multifactor.state,
    samlResponse: samlResponse.state,
    validation: {
      error: null,
    },
    redirect: redirect.state,
  };

  const api: Auth0.API.PostLogin = {
    get access() {
      return access.build(api)
    },

    get accessToken() {
      return accessToken.build(api);
    },

    get authentication() {
      return authentication.build(api);
    },

    cache: apiCache,

    get idToken() {
      return idToken.build(api);
    },

    get multifactor() {
      return multifactor.build(api);
    },

    get redirect() {
      return redirect.build(api);
    },

    rules: {
      wasExecuted: (ruleId) => {
        return executedRules.includes(ruleId);
      },
    },

    get samlResponse() {
      return samlResponse.build(api);
    },

    get user() {
      return userApiMock.build(api);
    },

    validation: {
      error: (code, message) => {
        state.validation.error = { code, message };
        return api;
      },
    },
  };

  return {
    implementation: api,
    state,
  };
}
