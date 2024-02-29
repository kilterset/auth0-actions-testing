import test from "node:test";
import { strictEqual } from "node:assert";
import { postLogin } from "../../../mock/events/post-login";

test("Post-login event", async (t) => {
  await t.test("resource_server", async (t) => {
    await t.test("is derived tenant by default", () => {
      const { tenant, resource_server } = postLogin();

      strictEqual(
        resource_server.identifier,
        `${tenant.id}.auth0.com/api/v2`,
        "resource_server does does not match expected tenant value"
      );
    });

    await t.test("can match customized tenant", () => {
      const { resource_server } = postLogin({ tenant: { id: "custom" } });

      strictEqual(
        resource_server.identifier,
        "custom.auth0.com/api/v2",
        "unexpected identifier"
      );
    });
  });
});
