import type { UserProfile } from '../types';
import type { RecommendationRequest } from './types';

export function toRecommendationRequest(
  profile: UserProfile,
): RecommendationRequest {
  const purposeMap: Record<UserProfile['supportGoal'], string> = {
    'New Business': 'business_new',
    'Expand Business': 'business_expand',
    Education: 'education',
    Agriculture: 'agriculture',
    'Skill Training': 'skill_training',
  };

  return {
    age: profile.age,
    gender: profile.gender.toLowerCase() as RecommendationRequest['gender'],
    income: profile.familyIncome,
    category: profile.priorityCategory.toLowerCase() as RecommendationRequest['category'],
    purpose: purposeMap[profile.supportGoal],
    cost: profile.projectCost,
    location: profile.state,
  };
}
