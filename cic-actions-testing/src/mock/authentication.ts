import OktaCIC from "../types";
import { define } from "./define";
import { riskAssessment } from "./risk-assessment";

export const authentication = define<OktaCIC.Authentication>(() => {
  return {
    methods: [
      {
        name: "mfa",
        timestamp: "2018-11-13T20:20:39+00:00",
        type: "email",
      },
      {
        name: "passkey",
        timestamp: "2018-11-13T20:22:13+00:00",
      },
    ],
    riskAssessment: riskAssessment(),
  };
});
