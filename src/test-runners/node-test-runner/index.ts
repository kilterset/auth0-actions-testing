import { TestContext } from "./test-context";
import * as auth0 from "../../index";
import { configureFetchMock } from "./fetch-mock";

export async function actionTestSetup(testContext: TestContext) {
  const fetchMock = await configureFetchMock(testContext);
  return { fetchMock, auth0 };
}
