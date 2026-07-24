import { mockSongs } from './songs';

export interface Album {
  id: string;
  name: string;
  artist: string;
  songIds: string[];
}

export const mockAlbums: Album[] = [
  { id: 'a1', name: 'Bay Nights', artist: 'Aurora Bay', songIds: ['1', '4'] },
  { id: 'a2', name: 'Static & Noise', artist: 'Milo Vance', songIds: ['2', '6'] },
  { id: 'a3', name: 'Horizons', artist: 'Fen & Rowe', songIds: ['3'] },
];

export interface Artist {
  id: string;
  name: string;
}

export const mockArtists: Artist[] = Array.from(new Set(mockSongs.map((s) => s.artist))).map((name) => ({
  id: name,
  name,
}));
