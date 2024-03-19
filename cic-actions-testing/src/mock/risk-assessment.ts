import { fail, ok } from "assert";
import OktaCIC from "../types";
import { chance } from "./chance";
import { define } from "./define";

export const impossibleTravelAssessment = define<OktaCIC.RiskAssessmentItem>(
  () => {
    return {
      confidence: randomConfidence(),
      code: chance.pickone([
        "minimal_travel_from_last_login",
        "travel_from_last_login",
        "substantial_travel_from_last_login",
        "impossible_travel_from_last_login",
        "invalid_travel",
        "mission_geoip",
        "anonymous_proxy",
        "unknown_location",
        "initial_login",
        "location_history_not_found",
        "assessment_not_available",
      ]),
    };
  }
);

export const newDeviceAssessment = define<OktaCIC.RiskAssessmentItem>(() => {
  return {
    confidence: randomConfidence(),
    code: chance.pickone([
      "match",
      "partial_match",
      "no_match",
      "initial_login",
      "unknown_device",
      "no_device_history",
      "assessment_not_available",
    ]),
    details: {
      device: chance.pickone(["known", "unknown"]),
      useragent: chance.pickone(["known", "unknown"]),
    },
  };
});

export const untrustedIPAssessment = define<OktaCIC.RiskAssessmentItem>(
  ({ params }) => {
    const ip = params.details?.ip || chance.ip();
    const matches = `${ip}/32`;

    return {
      confidence: randomConfidence(),
      code: chance.pickone([
        "not_found_on_deny_list",
        "found_on_deny_list",
        "invalid_ip_address",
        "assessment_not_available",
      ]),
      details: {
        category: "spam",
        ip: chance.ip(),
        matches,
        source: "STOPFORUMSPAM-1",
      },
    };
  }
);

const riskAssessmentTypes = {
  ImpossibleTravel: impossibleTravelAssessment,
  NewDevice: newDeviceAssessment,
  UntrustedIP: untrustedIPAssessment,
} as const;

const riskAssessmentKeys = Object.keys(riskAssessmentTypes);

interface RiskAssessmentTransientParams {
  numAssessments?: number;
  assessmentTypes?: (keyof typeof riskAssessmentTypes)[];
}

export const riskAssessment = define<
  OktaCIC.RiskAssessment,
  RiskAssessmentTransientParams
>(({ transientParams }) => {
  const numAssessments =
    transientParams.numAssessments ||
    transientParams.assessmentTypes?.length ||
    chance.integer({ min: 1, max: riskAssessmentKeys.length });

  const shuffledAssessmentTypes = chance.shuffle(
    riskAssessmentKeys
  ) as unknown as (keyof typeof riskAssessmentTypes)[];

  const assessmentTypes =
    transientParams.assessmentTypes ||
    shuffledAssessmentTypes.slice(0, numAssessments);

  if (numAssessments > assessmentTypes.length) {
    fail(
      `numAssessments is ${numAssessments}, which is greater than the ${riskAssessmentKeys.length} assessment types available`
    );
  }

  const assessments = assessmentTypes.reduce((acc, type) => {
    const assessment = riskAssessmentTypes[type]();
    return { ...acc, [type]: assessment };
  }, {} as Record<keyof typeof riskAssessmentTypes, OktaCIC.RiskAssessmentItem>);

  return {
    confidence: randomConfidence(),
    version: "1",
    assessments,
  };
});

const randomConfidence = () =>
  chance.pickone(["low", "medium", "high", "neutral"]);
