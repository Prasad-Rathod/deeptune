export interface RemoteSong {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  thumbnailUrl?: string;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
