import { get } from './client';
import type { Partner, PartnersResponse } from './types';

/** GET /api/partners?schemeId=:schemeId */
export function getPartnersForScheme(
  schemeId: string,
): Promise<PartnersResponse> {
  return get<PartnersResponse>(
    `/partners?schemeId=${encodeURIComponent(schemeId)}`,
  );
}

export type { Partner };
