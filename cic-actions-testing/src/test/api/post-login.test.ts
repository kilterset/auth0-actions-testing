import test from "node:test";
import { postLogin } from "../../mock/api";

test("PostLogin API", async (t) => {
  await t.test("cache", async (t) => {
    const api = postLogin();
  });
});
