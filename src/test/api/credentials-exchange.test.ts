import test from "node:test";
import { strictEqual, deepStrictEqual, throws, ok } from "node:assert";
import { credentialsExchange, cache } from "../../mock/api";
import { request, user } from "../../mock";
import { encodeHS256JWT } from "../../jwt/hs256";

test("Credentials Exchange API", async (t) => {
  await t.test("access", async (t) => {
    const { implementation: api, state } = credentialsExchange();

    strictEqual(
      api.access.deny("invalid_request", "Only cool kids allowed"),
      api
    );

    deepStrictEqual(state.access, {
      denied: {
        code: "invalid_request",
        reason: "Only cool kids allowed",
      }
    });
  });

  await t.test("accessToken", async (t) => {
    await t.test("can set custom claims", async (t) => {
      const { implementation: api, state } = credentialsExchange();
      strictEqual(api.accessToken.setCustomClaim("favourite_pet", "cat"), api);
      deepStrictEqual(state.accessToken.claims, { favourite_pet: "cat" });
    });
  });

  await t.test("cache", async (t) => {
    await t.test("can set cache", async (t) => {
      const { implementation: api, state } = credentialsExchange();
      strictEqual(api.cache.set("location", "Ōtautahi").type, "success");
      deepStrictEqual(state.cache.get("location"), "Ōtautahi");
    });

    await t.test("can get cache", async (t) => {
      const { implementation: api, state } = credentialsExchange({
        cache: { location: "Ōtautahi" },
      });

      strictEqual(state.cache.get("location"), "Ōtautahi");
      strictEqual(state.cache.get("nonexistent"), undefined);
    });
  });
});
