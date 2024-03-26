import test from "node:test";
import { deepStrictEqual, match, ok, strictEqual } from "node:assert";
import { session } from "../../mock";

test("session mock", async (t) => {
  await t.test("has sensible defaults", async () => {
    const { id, device } = session();

    ok(typeof id === "string" && id, "no id");
    ok(device, "no device");

    const asn = device?.last_asn || device?.initial_asn;
    ok(asn, "no ASN");
    match(asn, /^[0-9]+$/, "unexpected ASN format");

    const ip = device?.last_ip || device?.initial_ip;
    ok(ip, "no IP");
    match(ip, /^([a-f0-9:]+:+)+[a-f0-9]+$/, "unexpected IP format");
  });

  await t.test("can have any value overridden", async () => {
    const { id, device } = session({
      id: "sess_123",
      device: {
        last_asn: "AS123",
        last_ip: "a822:9353:a2ab:9d71:7348:685b:00da:1601",
      },
    });

    strictEqual(id, "sess_123", "id not overridden");

    deepStrictEqual(
      device,
      {
        last_asn: "AS123",
        last_ip: "a822:9353:a2ab:9d71:7348:685b:00da:1601",
      },
      "device not overridden"
    );
  });

  await t.test("device can be omitted", async () => {
    const { device } = session({ device: undefined });
    strictEqual(device, undefined, "device not omitted");
  });
});
