import { User } from "../user";
import { Cache } from "./cache";

export interface PostChangePassword {
  /**
   * Store and retrieve data that persists across executions.
   */
  readonly cache: Cache;
}
