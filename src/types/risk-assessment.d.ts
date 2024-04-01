export interface RiskAssessment {
  confidence: string;
  version: string;
  assessments: {
    [key: string]: RiskAssessmentItem;
  };
}

export interface RiskAssessmentItem {
  confidence: string;
  code: string;
  details?: {
    [key: string]: string;
  };
}
