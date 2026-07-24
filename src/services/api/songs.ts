import { apiFetch } from './client';
import type { RemoteSong } from './types';

export function searchSongs(query: string): Promise<RemoteSong[]> {
  return apiFetch<RemoteSong[]>(`/search?q=${encodeURIComponent(query)}`);
}

export function getSongMetadata(id: string): Promise<RemoteSong> {
  return apiFetch<RemoteSong>(`/songs/${encodeURIComponent(id)}`);
}
