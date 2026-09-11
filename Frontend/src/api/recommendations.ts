import { post } from './client';
import type { RecommendationRequest, RecommendationsResponse } from './types';

/** POST /api/recommendations */
export function getRecommendations(
  request: RecommendationRequest,
): Promise<RecommendationsResponse> {
  return post<RecommendationsResponse>('/recommendations', request);
}
