import test, { beforeEach } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { cache as mockCache } from "../../mock/api";

const NOW = Date.now();
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const FIFTEEN_MINS_IN_MS = 15 * 60 * 1000;
const ONE_DAY_FROM_NOW = NOW + ONE_DAY_IN_MS;
const FIFTEEN_MINS_FROM_NOW = NOW + FIFTEEN_MINS_IN_MS;

test("Mock cache API", async (t) => {
  t.mock.method(Date, "now", () => NOW);

  await t.test("supports basic operations", async (t) => {
    const cache = mockCache();

    strictEqual(cache.get("juicebox"), undefined);

    deepStrictEqual(cache.set("juicebox", "apple"), {
      type: "success",
      record: { value: "apple", expires_at: FIFTEEN_MINS_FROM_NOW },
    });

    strictEqual(cache.get("juicebox"), "apple");

    deepStrictEqual(cache.delete("juicebox"), { type: "success" });

    strictEqual(cache.get("juicebox"), undefined);

    deepStrictEqual(cache.delete("juicebox"), {
      type: "error",
      code: "CacheKeyDoesNotExist",
    });
  });

  await t.test("supports mock preconditions", async (t) => {
    const cache = mockCache({ sandwich: "ham" });

    strictEqual(cache.get("sandwich"), "ham");

    cache.set("sandwich", "tuna");

    strictEqual(cache.get("sandwich"), "tuna");
  });

  await t.test("setting with ttl", async (t) => {
    const cache = mockCache();

    cache.set("one-day-ttl", "ok", { ttl: ONE_DAY_IN_MS });

    t.mock.method(Date, "now", () => ONE_DAY_FROM_NOW - 1);

    strictEqual(cache.get("one-day-ttl"), "ok");

    t.mock.method(Date, "now", () => ONE_DAY_FROM_NOW);

    strictEqual(cache.get("one-day-ttl"), undefined);
  });

  await t.test("setting with expires_at", async (t) => {
    const cache = mockCache();

    cache.set("one-day-expiry", "ok", { expires_at: ONE_DAY_FROM_NOW });

    t.mock.method(Date, "now", () => ONE_DAY_FROM_NOW - 1);

    strictEqual(cache.get("one-day-expiry"), "ok");

    t.mock.method(Date, "now", () => ONE_DAY_FROM_NOW);

    strictEqual(cache.get("one-day-expiry"), undefined);
  });
});
