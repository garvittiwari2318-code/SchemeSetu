import { post } from './client';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from './types';

/** POST /api/recommendations */
export function getRecommendations(
  request: RecommendationRequest,
): Promise<RecommendationResponse> {
  return post<RecommendationResponse>('/recommendations', request);
}
