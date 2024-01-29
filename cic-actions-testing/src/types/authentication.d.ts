export interface Authentication {
  methods: {
    name: string;
    timestamp: string;
    type?: string;
  }[];
  riskAssessment: {
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
  };
}
