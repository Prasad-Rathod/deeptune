import { apiFetch } from './client';

export interface HealthResponse {
  status: string;
}

export function checkHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/health');
}
