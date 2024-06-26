import { requires } from "./requires";
import { exported } from "./exported";
import { secrets } from "./secrets";

export const ANALYSERS = {
  requires,
  exports: exported,
  secrets,
};

export * from "./analyse";
