import { TestContext } from "./test-context";

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
  const polyfillVersion = "v18";

  if (nodeMajorVersion !== polyfillVersion) {
    console.error(
      `Node version change detected (got ${nodeMajorVersion}, expected ${polyfillVersion}).\n`
    );

    console.error(
      `If you are upgrading Node: In order to mock fetch for Node ${polyfillVersion}'s fetch API, we polyfill fetch in our tests. We can potentially remove this when Auth0 upgrades beyond Node 18. Try removing the polyfill in ${__filename}. If it works, this file is no longer needed and you can remove \`node-fetch\` as a test dependency. If it doesn't, please update the version check in this file to reflect your current version of Node (${nodeMajorVersion}).`
    );
    process.exit(1);
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
