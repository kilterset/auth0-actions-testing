import { Factor } from "../../types";

export interface FactorList {
  allOptions: Factor[];
  default: Factor | undefined;
}

export function authenticationMock(_flow: string, { userId }: { userId: string }) {
  let numCallsToSetPrimaryUser = 0;

  const state = {
    primaryUserId: userId,
    challenge: false as false | FactorList,
    enrollment: false as false | FactorList,
    newlyRecordedMethods: [] as string[],
  };

  const build = <T>(api: T) => ({
    challengeWith: (factor: Factor, options?: { additionalFactors?: Factor[] }) => {
      const additionalFactors = options?.additionalFactors ?? [];

      state.challenge = {
        allOptions: [factor, ...additionalFactors],
        default: factor,
      };
    },
    challengeWithAny(factors: Factor[]) {
      state.challenge = {
        allOptions: factors,
        default: undefined,
      };
    },
    enrollWith: (factor: Factor, options?: { additionalFactors?: Factor[] }) => {
      const additionalFactors = options?.additionalFactors ?? [];

      state.enrollment = {
        allOptions: [factor, ...additionalFactors],
        default: factor,
      };
    },
    enrollWithAny(factors: Factor[]) {
      state.enrollment = {
        allOptions: factors,
        default: undefined,
      };
    },
    setPrimaryUser: (primaryUserId: string) => {
      numCallsToSetPrimaryUser++;

      if (numCallsToSetPrimaryUser > 1) {
        throw new Error(
          "`authentication.setPrimaryUser` can only be set once per transaction"
        );
      }

      state.primaryUserId = primaryUserId;
    },
    recordMethod: (providerUrl: string) => {
      state.newlyRecordedMethods.push(providerUrl);
      return api;
    },
  });

  return { state, build };
}
