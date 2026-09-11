import { get } from './client';
import type { Scheme, SchemeResponse, SchemesResponse } from './types';

/** GET /api/schemes */
export function getSchemes(active?: boolean): Promise<SchemesResponse> {
  const query = typeof active === 'undefined' ? '' : `?active=${active}`;
  return get<SchemesResponse>(`/schemes${query}`);
}

/** GET /api/schemes/:id */
export function getSchemeById(id: string): Promise<SchemeResponse> {
  return get<SchemeResponse>(`/schemes/${encodeURIComponent(id)}`);
}

export type { Scheme };
