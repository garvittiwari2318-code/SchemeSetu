import type { Scheme, SchemeMatch } from '../types';
import type { Recommendation } from './types';

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

export function mapRecommendationToSchemeMatch(
  recommendation: Recommendation,
): SchemeMatch {
  const passedRules = recommendation.ruleExplanations?.filter((rule) => rule.passed) ?? [];
  const hardFailedRules =
    recommendation.ruleExplanations?.filter((rule) => rule.hard && !rule.passed) ?? [];

  const matchedCriteria = passedRules.map((rule) => rule.explanation);
  const prerequisites = hardFailedRules.map((rule) => rule.explanation);

  const scheme: Scheme = {
    id: recommendation.schemeId,
    title: recommendation.name,
    shortName: recommendation.schemeId,

    ministry: recommendation.ministry,
    category: recommendation.category as Scheme['category'],
    sectorType: recommendation.sectorType as Scheme['sectorType'],

    benefitHeadline: recommendation.benefitHeadline,

    maxCeilingText: recommendation.maxCeilingText,

    description: recommendation.description,

    statutoryClause: recommendation.statutoryClause,

    officialPortalUrl: recommendation.officialPortalUrl,
    objectives: recommendation.objective,

    eligibilityParameters: matchedCriteria,
    requiredDocuments: recommendation.requiredDocuments,
  };

  return {
    scheme,
    fitPercentage: recommendation.matchScore,
    statutoryJustification:
      matchedCriteria.length > 0
        ? matchedCriteria.join(' ')
        : 'Eligibility and match score were evaluated by the backend rule engine.',
    matchedCriteria,
    prerequisites,
    subsidyEstimate:
      recommendation.maxLoanAmount != null
        ? `Loan support up to ${formatCurrency(recommendation.maxLoanAmount)}`
        : 'Benefit details are provided by the backend scheme data.',
  };
}

export function mapRecommendationsToSchemeMatches(
  recommendations: Recommendation[],
): SchemeMatch[] {
  return recommendations.map(mapRecommendationToSchemeMatch);
}
