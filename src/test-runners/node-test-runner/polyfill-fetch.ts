import { TestContext } from "./test-context";

const NODE_VERSIONS_TO_POLYFILL = ["v18"];

/**
 * Polyfills the global `fetch` function. We do this to make our mock `fetch`
 * implementation work in Node.js v18.
 *
 * None of `fetch` mocking libraries at the time of v18 properly implemented the
 * full API (e.g. passing `FormData` as the body of a request, which is commonly
 * used in Auth0 Actions documentation examples). By replacing the built-in
 * `fetch` with the `node-fetch` polyfill, we can use libraries like `nock` and
 * `fetch-mock` to successfully mimic the full `fetch` API.
 *
 * Libraries fixed this in future releases of Node, and this polyfill can be
 * removed when Auth0 begins supporting beyond Node 18.
 */
export async function polyfillFetch(testContext: TestContext) {
  const nodeMajorVersion = process.version.split(".")[0];

  if (!NODE_VERSIONS_TO_POLYFILL.includes(nodeMajorVersion)) {
    return;
  }

  const originalFetch = globalThis.fetch;

  testContext.before(async () => {
    const { fetch } = (await import("node-fetch")) as any;
    globalThis.fetch = fetch;
  });

  testContext.after(() => {
    globalThis.fetch = originalFetch;
  });
}
