import test from "node:test";
import { deepStrictEqual, match, ok, strictEqual } from "node:assert";
import { session } from "../../mock";

test("session mock", async (t) => {
  await t.test("has sensible defaults", async () => {
    const { id, device } = session();

    ok(typeof id === "string" && id, "no id");
    ok(device?.last_asn, "no last_asn");
    match(device?.last_asn, /^[0-9]+$/, "unexpected last_asn format");
    ok(device?.last_ip, "no ip_address");
    match(
      device?.last_ip,
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
      "unexpected last_ip format"
    );
  });

  await t.test("can have any value overridden", async () => {
    const { id, device } = session({
      id: "sess_123",
      device: {
        last_asn: "AS123",
        last_ip: "118.234.180.183",
      },
    });

    strictEqual(id, "sess_123", "id not overridden");

    deepStrictEqual(
      device,
      {
        last_asn: "AS123",
        last_ip: "118.234.180.183",
      },
      "device not overridden"
    );
  });

  await t.test("device can be omitted", async () => {
    const { device } = session({ device: undefined });
    strictEqual(device, undefined, "device not omitted");
  });
});
