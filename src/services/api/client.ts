import { API_BASE_URL, API_TIMEOUT_MS } from './config';
import { ApiError } from './types';

export async function apiFetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request to backend timed out');
    }
    throw new ApiError('Could not reach backend — check your network and API_BASE_URL');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiError(`Backend responded with an error`, response.status);
  }

  return (await response.json()) as T;
}
