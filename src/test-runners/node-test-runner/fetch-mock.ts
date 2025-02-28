import { TestContext } from "./test-context";

export async function configureFetchMock(testContext: TestContext) {
  const { default: fetchMock } = await import("fetch-mock");
  testContext.afterEach(fetchMock.restore);
  return fetchMock;
}
