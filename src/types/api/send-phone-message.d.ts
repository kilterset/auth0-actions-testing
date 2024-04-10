import { User } from "../user";
import { Cache } from "./cache";

export interface SendPhoneMessage {
  /**
   * Store and retrieve data that persists across executions.
   */
  readonly cache: Cache;
}
