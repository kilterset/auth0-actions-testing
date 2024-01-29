import OktaCIC from "../types";
import { define } from "./define";

export const riskAssessment = define<OktaCIC.RiskAssessment>(() => {
  return {
    confidence: "low",
    version: "1",
    assessments: {
      UntrustedIP: {
        confidence: "low",
        code: "found_on_deny_list",
        details: {
          ip: "1.1.1.1",
          matches: "1.1.1.1/32",
          source: "STOPFORUMSPAM-1",
          category: "abuse",
        },
      },
      NewDevice: {
        confidence: "low",
        code: "no_match",
        details: {
          device: "unknown",
          useragent: "unknown",
        },
      },
      ImpossibleTravel: {
        confidence: "low",
        code: "impossible_travel_from_last_login",
      },
    },
  };
});
