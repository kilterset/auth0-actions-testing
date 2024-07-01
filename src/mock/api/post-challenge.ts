import Auth0, { Factor } from "../../types";
import { cache as mockCache } from "./cache";
import { user as mockUser } from "../user";
import { request as mockRequest } from "../request";
import { redirectMock } from "./redirect";

export interface PostChallengeOptions {
  user?: Auth0.User;
  cache?: Record<string, string>;
  now?: ConstructorParameters<typeof Date>[0];
  request?: Auth0.Request;
}

interface FactorList {
  allOptions: Factor[];
  default: Factor | undefined;
}

export interface PostChallengeState {
  user: Auth0.User;
  cache: Auth0.API.Cache;
  access: { denied: false } | { denied: { reason: string } };
  authentication: {
    challenge: FactorList | false;
    enrollment: FactorList | false;
    newlyRecordedMethods: string[];
  };
  redirect: { url: URL; queryParams: Record<string, string> } | null;
}

export function postChallenge({
  user,
  request,
  cache,
  now: nowValue,
}: PostChallengeOptions = {}) {
  const apiCache = mockCache(cache);
  const userValue = user ?? mockUser();
  const requestValue = request ?? mockRequest();
  const now = new Date(nowValue || Date.now());
  const redirect = redirectMock("PostChallenge", {
    now,
    request: requestValue,
    user: userValue,
  });

  const state: PostChallengeState = {
    authentication: {
      challenge: false,
      enrollment: false,
      newlyRecordedMethods: [],
    },

    user: userValue,
    access: { denied: false },
    cache: apiCache,
    get redirect() {
      return redirect.state.target;
    },
  };

  const api: Auth0.API.PostChallenge = {
    access: {
      deny: (reason) => {
        state.access = { denied: { reason } };
        return api;
      },
    },

    authentication: {
      challengeWith: (factor, options) => {
        const additionalFactors = options?.additionalFactors ?? [];

        state.authentication.challenge = {
          allOptions: [factor, ...additionalFactors],
          default: factor,
        };
      },
      challengeWithAny(factors) {
        state.authentication.challenge = {
          allOptions: factors,
          default: undefined,
        };
      },
    },

    cache: apiCache,

    get redirect() {
      return redirect.build(api);
    },
  };

  return {
    implementation: api,
    state,
  };
}
