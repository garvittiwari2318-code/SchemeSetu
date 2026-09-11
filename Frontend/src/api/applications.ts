import { get, post } from './client';
import type {
  ApplicationResponse,
  ApplicationsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from './types';

/** POST /api/applications */
export function createApplication(
  application: CreateApplicationRequest,
): Promise<CreateApplicationResponse> {
  return post<CreateApplicationResponse>('/applications', application);
}

/** GET /api/applications?schemeId=:schemeId */
export function getApplications(
  schemeId?: string,
): Promise<ApplicationsResponse> {
  const query = schemeId
    ? `?schemeId=${encodeURIComponent(schemeId)}`
    : '';
  return get<ApplicationsResponse>(`/applications${query}`);
}

/** GET /api/applications/:id */
export function getApplicationById(
  id: string,
): Promise<ApplicationResponse> {
  return get<ApplicationResponse>(`/applications/${encodeURIComponent(id)}`);
}
