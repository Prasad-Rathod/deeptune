import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../data/songs';

interface PlayerContextValue {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSong = queue[currentIndex] ?? null;

  useEffect(() => {
    if (currentSong) {
      console.log(`Now playing: ${currentSong.title} by ${currentSong.artist}`);
      // Phase 7 will replace this log with telling the real audio engine to load and play the track.
    }
  }, [currentSong]);

  function playSong(song: Song, newQueue?: Song[]) {
    const list = newQueue ?? [song];
    const index = list.findIndex((s) => s.id === song.id);
    setQueue(list);
    setCurrentIndex(index === -1 ? 0 : index);
    setIsPlaying(true);
  }

  function togglePlay() {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  }

  function playNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, queue.length - 1));
    setIsPlaying(true);
  }

  function playPrevious() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setIsPlaying(true);
  }

  return (
    <PlayerContext.Provider
      value={{ queue, currentSong, isPlaying, playSong, togglePlay, playNext, playPrevious }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
