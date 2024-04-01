import { TestContext } from "./test-context";

const { polyfillFetch } = require("./polyfill-fetch");

export async function configureFetchMock(testContext: TestContext) {
  await polyfillFetch(testContext);
  const mockFetch = require("fetch-mock");
  testContext.afterEach(mockFetch.restore);
  return mockFetch;
}
