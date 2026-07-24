import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../data/songs';

interface PlayerContextValue {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  progressSec: number;
  isShuffle: boolean;
  isRepeat: boolean;
  liked: Set<string>;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [isShuffle, setIsShuffle] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set(['2', '4']));

  const currentSong = queue[currentIndex] ?? null;

  useEffect(() => {
    if (currentSong) {
      console.log(`Now playing: ${currentSong.title} by ${currentSong.artist}`);
      // Phase 7 will replace this log with telling the real audio engine to load and play the track.
    }
  }, [currentSong]);

  // Simulates playback progress ticking forward, one second at a time.
  // Phase 7 will drive progressSec from the real audio engine instead of a timer.
  useEffect(() => {
    if (!isPlaying || !currentSong) return;
    const interval = setInterval(() => setProgressSec((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // Once progress reaches the current track's duration, advance to the next
  // track and reset progress — kept as its own effect to avoid nesting one
  // state updater inside another.
  useEffect(() => {
    if (!currentSong || progressSec < currentSong.durationSec) return;
    setCurrentIndex((i) => (queue.length ? (i + 1) % queue.length : i));
    setProgressSec(0);
  }, [progressSec, currentSong, queue.length]);

  function playSong(song: Song, newQueue?: Song[]) {
    const list = newQueue ?? [song];
    const index = list.findIndex((s) => s.id === song.id);
    setQueue(list);
    setCurrentIndex(index === -1 ? 0 : index);
    setProgressSec(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  }

  function playNext() {
    setCurrentIndex((prev) => (queue.length ? (prev + 1) % queue.length : prev));
    setProgressSec(0);
    setIsPlaying(true);
  }

  function playPrevious() {
    setCurrentIndex((prev) => (queue.length ? (prev - 1 + queue.length) % queue.length : prev));
    setProgressSec(0);
    setIsPlaying(true);
  }

  function toggleShuffle() {
    setIsShuffle((prev) => !prev);
  }

  function toggleRepeat() {
    setIsRepeat((prev) => !prev);
  }

  function toggleLike(songId: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  }

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      currentSong,
      isPlaying,
      progressSec,
      isShuffle,
      isRepeat,
      liked,
      playSong,
      togglePlay,
      playNext,
      playPrevious,
      toggleShuffle,
      toggleRepeat,
      toggleLike,
    }),
    [queue, currentSong, isPlaying, progressSec, isShuffle, isRepeat, liked]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
