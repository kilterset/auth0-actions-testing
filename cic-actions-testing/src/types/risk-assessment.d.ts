export interface RiskAssessment {
  confidence: string;
  version: string;
  assessments: {
    [key: string]: {
      confidence: string;
      code: string;
      details?: {
        [key: string]: string;
      };
    };
  };
}
