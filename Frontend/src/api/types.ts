/**
 * Types for the existing SchemeSetu backend REST API.
 * These types intentionally mirror the backend request/response contracts.
 */

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

  eligible: boolean;
  matchScore: number;
  passedRules: unknown[];
  failedRules: unknown[];
  ruleExplanations: RuleExplanation[];
  interestRate: number;
  maxLoanAmount: number;
  maxTenureYears: number;
  moratoriumMonths: number;
}

export interface RecommendationsResponse {
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

  eligibilityParameters: string[];
  requiredDocuments: string[];

  interestRate: number | null;
  maxLoanAmount: number | null;
  maxTenureYears: number | null;
  moratoriumMonths: number | null;

  recommendationEnabled: boolean;
  active: boolean;
  version: number;

  rules: SchemeRule[];
  scoring: SchemeScoring;

  createdAt: string;
  updatedAt: string;
}

export interface SchemesResponse {
  success: boolean;
  count: number;
  data: Scheme[];
}

export interface SchemeResponse {
  success: boolean;
  data: Scheme;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

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

export interface PartnersResponse {
  success: boolean;
  count: number;
  data: Partner[];
}

export interface ApplicationAnswers extends RecommendationRequest {
  [key: string]: unknown;
}

export interface CreateApplicationRequest {
  applicantName: string;
  schemeId: string;
  answers: ApplicationAnswers;
}

export interface CreatedApplication {
  applicationId: string;
  applicantName: string;
  schemeId: string;
  schemeName: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  eligible: boolean;
  matchScore: number;
  createdAt: string;
}

export interface CreateApplicationResponse {
  success: boolean;
  data: CreatedApplication;
}

export interface ApplicationUser {
  _id: string;
  name: string;
  email: string;
}

export interface ApplicationSchemeSummary {
  _id: string;
  schemeId: string;
  name: string;
  interestRate?: number;
  maxLoanAmount?: number;
}

export interface ApplicationEvaluation {
  eligible: boolean | null;
  score: number | null;
  failedHardRules: string[];
  explanations: string[];
}

export interface Application {
  _id: string;
  user: ApplicationUser;
  scheme: ApplicationSchemeSummary;
  schemeVersion: number;
  answers: Record<string, unknown>;
  evaluation: ApplicationEvaluation;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  partner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: Application[];
}

export interface ApplicationResponse {
  success: boolean;
  data: Application;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  database: string;
}
