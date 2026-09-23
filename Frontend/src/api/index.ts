export { ApiError, getApiBaseUrl } from './client';
export { getRecommendations } from './recommendations';
export { toRecommendationRequest } from './profileAdapter';
export { mapRecommendationToSchemeMatch, mapRecommendationsToSchemeMatches } from './recommendationMapper';
export { getSchemes, getSchemeById } from './schemes';
export { getPartnersForScheme } from './partners';
export {
  createApplication,
  getApplications,
  getApplicationById,
} from './applications';
export {
  register,
  login,
  getCurrentUser,
  logout,
} from './auth';

export type {
  AuthUser,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  CurrentUserResponse,
} from './auth';
export type * from './types';
