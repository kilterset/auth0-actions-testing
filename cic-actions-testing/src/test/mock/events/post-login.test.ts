import test from "node:test";
import { ok, strictEqual } from "node:assert";
import { postLogin } from "../../../mock/events/post-login";
import { connection } from "../../../mock";

test("Post-login event", async (t) => {
  await t.test("tenant ID informs other values", async (t) => {
    await t.test("when not explicitly set", () => {
      const { tenant, resource_server, request } = postLogin();

      strictEqual(
        resource_server.identifier,
        `https://${tenant.id}.auth0.com/userinfo`,
        "resource_server does does not match expected tenant value"
      );

      strictEqual(
        request.hostname,
        `${tenant.id}.auth0.com`,
        "resource_server does does not match expected tenant value"
      );
    });

    await t.test("when customized", () => {
      const { resource_server, request } = postLogin({
        tenant: { id: "custom" },
      });

      strictEqual(
        resource_server.identifier,
        "https://custom.auth0.com/userinfo",
        "resource_server does does not match expected tenant value"
      );

      strictEqual(
        request.hostname,
        `custom.auth0.com`,
        "resource_server does does not match expected tenant value"
      );
    });
  });

  await t.test("connection informs other values", async (t) => {
    await t.test("when not explicitly set", () => {
      const { connection, user, request } = postLogin();

      strictEqual(
        user.user_id.split("|")[0],
        connection.strategy,
        "user.user_id prefix does does not match expected connection strategy"
      );

      ok(user.identities?.length, "expected at least one user identity");

      strictEqual(
        user.identities[0].connection,
        connection.name,
        "user.identity.connection does does not match expected connection name"
      );

      strictEqual(
        request.query.connection,
        connection.name,
        "request.query.connection does does not match expected connection name"
      );
    });

    await t.test("when customized", () => {
      const customConnection = connection({
        name: "custom-name",
        strategy: "custom",
      });

      const { user, request } = postLogin({ connection: customConnection });

      strictEqual(
        user.user_id.split("|")[0],
        "custom",
        "user.user_id prefix does does not match expected connection strategy"
      );

      ok(user.identities?.length, "expected at least one user identity");

      strictEqual(
        user.identities[0].connection,
        "custom-name",
        "user.identity.connection does does not match expected connection name"
      );

      strictEqual(
        request.query.connection,
        "custom-name",
        "request.query.connection does does not match expected connection name"
      );
    });
  });
});
