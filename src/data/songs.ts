export interface Song {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
}

export const mockSongs: Song[] = [
  { id: '1', title: 'Night Drive', artist: 'Aurora Bay', durationSec: 214 },
  { id: '2', title: 'Slow Static', artist: 'Milo Vance', durationSec: 187 },
  { id: '3', title: 'Glass Horizon', artist: 'Fen & Rowe', durationSec: 251 },
  { id: '4', title: 'Paper Moon', artist: 'Aurora Bay', durationSec: 198 },
  { id: '5', title: 'Low Light', artist: 'Deja Cruz', durationSec: 233 },
  { id: '6', title: 'Halfway Home', artist: 'Milo Vance', durationSec: 176 },
];

export const recentlyPlayed: Song[] = [mockSongs[2], mockSongs[0], mockSongs[4]];

export interface Playlist {
  id: string;
  name: string;
  desc: string;
  songIds: string[];
}

export const mockPlaylists: Playlist[] = [
  { id: 'p1', name: 'Late Night Focus', desc: 'Deep, wordless focus', songIds: ['1', '3', '5'] },
  { id: 'p2', name: 'Roadtrip', desc: 'Windows down, volume up', songIds: ['2', '4', '6'] },
];
