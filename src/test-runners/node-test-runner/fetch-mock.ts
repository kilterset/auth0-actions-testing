import { TestContext } from "./test-context";
import { polyfillFetch } from "./polyfill-fetch";

export async function configureFetchMock(testContext: TestContext) {
  await polyfillFetch(testContext);
  const { default: fetchMock } = await import("fetch-mock");
  testContext.afterEach(fetchMock.restore);
  return fetchMock;
}
