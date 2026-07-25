export interface Song {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  // Royalty-free sample tracks standing in for real audio until Phase 6's
  // backend can legitimately source playable streams for searched songs.
  audioUrl: string;
  // Placeholder cover art (stable per-song via a fixed seed) standing in for
  // real album art until Phase 6's backend can source real metadata. Optional
  // because on-device tracks (see localAudio.ts) have no artwork available.
  artworkUrl?: string;
}

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Night Drive',
    artist: 'Aurora Bay',
    durationSec: 214,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-1/300/300',
  },
  {
    id: '2',
    title: 'Slow Static',
    artist: 'Milo Vance',
    durationSec: 187,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-2/300/300',
  },
  {
    id: '3',
    title: 'Glass Horizon',
    artist: 'Fen & Rowe',
    durationSec: 251,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-3/300/300',
  },
  {
    id: '4',
    title: 'Paper Moon',
    artist: 'Aurora Bay',
    durationSec: 198,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-4/300/300',
  },
  {
    id: '5',
    title: 'Low Light',
    artist: 'Deja Cruz',
    durationSec: 233,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-5/300/300',
  },
  {
    id: '6',
    title: 'Halfway Home',
    artist: 'Milo Vance',
    durationSec: 176,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    artworkUrl: 'https://picsum.photos/seed/deeptune-6/300/300',
  },
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
