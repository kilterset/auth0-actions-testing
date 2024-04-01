import { beforeEach, afterEach, before, after, mock } from "node:test";

// Ideally this would match node:test's TestContext, but this class is not
// exported.
export interface TestContext {
  beforeEach: typeof beforeEach;
  afterEach: typeof afterEach;
  before: typeof before;
  after: typeof after;
  mock: typeof mock;
}
