export interface RecommendationRequest {
  age: number;
  gender: 'male' | 'female' | 'other';
  income: number;
  category: 'yes' | 'no' | 'true' | 'false';
  purpose: string;
  cost: number;
  location: string;
}

export interface RuleExplanation {
  field: string;
  expectedCondition: string;
  actualValue: unknown;
  passed: boolean;
  hard: boolean;
  explanation: string;
}

export interface Recommendation {
  schemeId: string;
  name: string;
  eligible: boolean;
  matchScore: number;
  passedRules: unknown[];
  failedRules: unknown[];
  ruleExplanations: RuleExplanation[];
  interestRate: number | null;
  maxLoanAmount: number | null;
  maxTenureYears: number | null;
  moratoriumMonths: number | null;
  objective: string;
  ministry: string;
  category: string;
  sectorType: string;
  benefitHeadline: string;
  maxCeilingText: string;
  statutoryClause: string;
  description: string;
  officialPortalUrl: string;
  requiredDocuments: string[];
}

export interface RecommendationResponse {
  success: boolean;
  count: number;
  recommendations: Recommendation[];
}

export interface SchemeRule {
  field: string;
  operator: '=' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'between';
  value: unknown;
  hard: boolean;
  weight: number;
  explanation: string;
}

export interface SchemeScoring {
  baseScore: number;
  min: number;
  max: number;
}

export interface Scheme {
  _id: string;
  schemeId: string;
  name: string;
  description: string;
  objective: string;
  ministry: string;
  category: string;
  sectorType: string;
  benefitHeadline: string;
  maxCeilingText: string;
  statutoryClause: string;
  officialPortalUrl: string;
  requiredDocuments: string[];
  interestRate: number | null;
  maxLoanAmount: number | null;
  maxTenureYears: number | null;
  moratoriumMonths: number | null;
  active: boolean;
  recommendationEnabled: boolean;
  version: number;
  rules: SchemeRule[];
  scoring: SchemeScoring;
  createdAt: string;
  updatedAt: string;
}

export interface SchemesResponse { success: boolean; count: number; data: Scheme[]; }
export interface SchemeResponse { success: boolean; data: Scheme; }

export interface GeoJSONPoint { type: 'Point'; coordinates: [number, number]; }

export interface Partner {
  _id: string;
  name: string;
  city: string;
  location: GeoJSONPoint;
  schemes: string[];
  verifiedOn: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnersResponse { success: boolean; count: number; data: Partner[]; }

export type ApplicationAnswers = RecommendationRequest;

export interface CreateApplicationRequest {
  schemeId: string;
  answers: ApplicationAnswers;
}

export type ApplicationStatus =
  | 'draft'
  | 'eligibility_confirmed'
  | 'documents_pending'
  | 'under_verification'
  | 'ready_for_submission'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export type ApplicationDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

export interface ApplicationDocument {
  requirementId: string;
  name: string;
  mandatory: boolean;
  status: ApplicationDocumentStatus;
  fileReference: string | null;
  uploadedAt: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
}

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  note: string | null;
  changedBy: string | null;
  changedAt: string;
}

export interface ApplicationSubmission {
  mode: 'external_portal' | 'api' | null;
  officialPortalUrl: string | null;
  externalReference: string | null;
  submittedAt: string | null;
}

export interface ApplicationUser { _id: string; name: string; email: string; }

export interface ApplicationSchemeSummary {
  _id: string;
  schemeId: string;
  name: string;
  objective?: string;
  ministry?: string;
  category?: string;
  sectorType?: string;
  benefitHeadline?: string;
  maxCeilingText?: string;
  officialPortalUrl?: string;
  requiredDocuments?: string[];
  interestRate?: number | null;
  maxLoanAmount?: number | null;
  version?: number;
}

export interface ApplicationEvaluation {
  eligible: boolean | null;
  score: number | null;
  failedHardRules: string[];
  explanations: string[];
  evaluatedAt: string | null;
}

export interface Application {
  _id: string;
  user: ApplicationUser;
  scheme: ApplicationSchemeSummary;
  schemeVersion: number;
  answers: Record<string, unknown>;
  evaluation: ApplicationEvaluation;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  documents: ApplicationDocument[];
  submission: ApplicationSubmission;
  partner?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreatedApplication = Application & { applicationId?: string };

export interface CreateApplicationResponse { success: boolean; data: CreatedApplication; }
export interface ApplicationsResponse { success: boolean; count: number; data: Application[]; }
export interface ApplicationResponse { success: boolean; data: Application; }

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  database: string;
}
