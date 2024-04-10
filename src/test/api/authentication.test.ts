import test from "node:test";
import { authenticationMock } from "../../mock/api/authentication";
import { ok, strictEqual } from "node:assert";

test("authentication mock", async (t) => {
  const baseApi = Symbol("Base API");

  await t.test("challengeWith", async (t) => {
    await t.test("factor", async (t) => {
      const { build, state } = authenticationMock("Another Flow", { userId: "42" });
      const api = build(baseApi);

      api.challengeWith({ type: "email" });

      ok(state.challenge, "Expected challenge to be set");
      strictEqual(state.challenge.default?.type, "email", "Expected default factor to be set");
      strictEqual(state.challenge.allOptions?.length, 1, "Expected additional factors to be set");
      strictEqual(state.challenge.allOptions?.[0].type, "email", "Expected additional factors to be email");
    });

    await t.test("additional factors", async (t) => {
      const { build, state } = authenticationMock("Another Flow", { userId: "42" });
      const api = build(baseApi);

      api.challengeWith({ type: "otp" }, { additionalFactors: [{ type: "email" }] });

      ok(state.challenge, "Expected challenge to be set");
      strictEqual(state.challenge.default?.type, "otp", "Expected default factor to be set");
      strictEqual(state.challenge.allOptions?.length, 2, "Expected additional factors to be set");
      strictEqual(state.challenge.allOptions?.[0].type, "otp", "Expected additional factor to be otp");
      strictEqual(state.challenge.allOptions?.[1].type, "email", "Expected additional factor to be email");
    });
  });

  await t.test('challengeWithAny', async (t) => {
    const { build, state } = authenticationMock("Another Flow", { userId: "42" });
    const api = build(baseApi);

    api.challengeWithAny([{ type: "email" }, { type: "otp" }]);

    ok(state.challenge, "Expected challenge to be set");
    strictEqual(state.challenge.default, undefined, "Expected default factor to be undefined");
    strictEqual(state.challenge.allOptions?.length, 2, "Expected additional factors to be set");
    strictEqual(state.challenge.allOptions?.[0].type, "email", "Expected additional factor to be email");
    strictEqual(state.challenge.allOptions?.[1].type, "otp", "Expected additional factor to be otp");
  });

  await t.test("enrollWith", async (t) => {
    await t.test("factor", async (t) => {
      const { build, state } = authenticationMock("Another Flow", { userId: "42" });
      const api = build(baseApi);

      api.enrollWith({ type: "email" });

      ok(state.enrollment, "Expected enrollment to be set");
      strictEqual(state.enrollment.default?.type, "email", "Expected default factor to be set");
      strictEqual(state.enrollment.allOptions?.length, 1, "Expected additional factors to be set");
      strictEqual(state.enrollment.allOptions?.[0].type, "email", "Expected additional factors to be email");
    });

    await t.test("additional factors", async (t) => {
      const { build, state } = authenticationMock("Another Flow", { userId: "42" });
      const api = build(baseApi);

      api.enrollWith({ type: "otp" }, { additionalFactors: [{ type: "email" }] });

      ok(state.enrollment, "Expected enrollment to be set");
      strictEqual(state.enrollment.default?.type, "otp", "Expected default factor to be set");
      strictEqual(state.enrollment.allOptions?.length, 2, "Expected additional factors to be set");
      strictEqual(state.enrollment.allOptions?.[0].type, "otp", "Expected additional factor to be otp");
      strictEqual(state.enrollment.allOptions?.[1].type, "email", "Expected additional factor to be email");
    });
  });

  await t.test('enrollWithAny', async (t) => {
    const { build, state } = authenticationMock("Another Flow", { userId: "42" });
    const api = build(baseApi);

    api.enrollWithAny([{ type: "email" }, { type: "otp" }]);

    ok(state.enrollment, "Expected enrollment to be set");
    strictEqual(state.enrollment.default, undefined, "Expected default factor to be undefined");
    strictEqual(state.enrollment.allOptions?.length, 2, "Expected additional factors to be set");
    strictEqual(state.enrollment.allOptions?.[0].type, "email", "Expected additional factor to be email");
    strictEqual(state.enrollment.allOptions?.[1].type, "otp", "Expected additional factor to be otp");
  });

  await t.test("setPrimaryUser", async (t) => {
    const { build, state } = authenticationMock("Another Flow", { userId: "42" });
    const api = build(baseApi);

    api.setPrimaryUser("43");

    strictEqual(state.primaryUserId, "43", "Expected primary user to be set");
  });

  await t.test("recordMethod", async (t) => {
    const { build, state } = authenticationMock("Another Flow", { userId: "42" });
    const api = build(baseApi);

    api.recordMethod("https://example.com");

    strictEqual(state.newlyRecordedMethods.length, 1, "Expected newly recorded methods to be set");
    strictEqual(state.newlyRecordedMethods[0], "https://example.com", "Expected newly recorded method to be set");

    api.recordMethod("https://another.example.com");

    strictEqual(state.newlyRecordedMethods.length, 2, "Expected newly recorded methods to be set");
    strictEqual(state.newlyRecordedMethods[1], "https://another.example.com", "Expected newly recorded method to be set");
  });
});
