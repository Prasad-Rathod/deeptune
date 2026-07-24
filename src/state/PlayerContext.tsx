import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync, requestNotificationPermissionsAsync } from 'expo-audio';
import type { Song } from '../data/songs';

interface PlayerContextValue {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isBuffering: boolean;
  progressSec: number;
  durationSec: number;
  isShuffle: boolean;
  isRepeat: boolean;
  liked: Set<string>;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set(['2', '4']));

  const currentSong = queue[currentIndex] ?? null;

  // The real native audio engine. It starts with no source loaded; playSong()
  // and advance() below tell it what to load via player.replace(...).
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  // Runs once: configures the audio session so playback continues when the
  // app is backgrounded, and requests the Android permission needed to show
  // lock-screen/notification media controls.
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
    if (Platform.OS === 'android') {
      requestNotificationPermissionsAsync();
    }
  }, []);

  // Loads the current track into the real player whenever the *track itself*
  // changes (keyed on id, not the whole object, so this doesn't refire on
  // every render — only when the song actually changes).
  useEffect(() => {
    if (!currentSong) return;
    player.replace({ uri: currentSong.audioUrl });
    player.play();
    player.setActiveForLockScreen(true, {
      title: currentSong.title,
      artist: currentSong.artist,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // The native player itself tells us when a track ends — no more manual
  // "has progress passed duration" polling like the Phase 3 simulation.
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (isRepeat) {
      player.seekTo(0);
      player.play();
    } else {
      advance(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  function playSong(song: Song, newQueue?: Song[]) {
    const list = newQueue ?? [song];
    const index = list.findIndex((s) => s.id === song.id);
    setQueue(list);
    setCurrentIndex(index === -1 ? 0 : index);
  }

  function togglePlay() {
    if (!currentSong) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function advance(direction: 1 | -1) {
    if (queue.length === 0) return;
    if (isShuffle && queue.length > 1) {
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((prev) => (prev + direction + queue.length) % queue.length);
    }
  }

  function playNext() {
    advance(1);
  }

  function playPrevious() {
    advance(-1);
  }

  function seekTo(seconds: number) {
    player.seekTo(seconds);
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
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      progressSec: status.currentTime,
      durationSec: status.duration || currentSong?.durationSec || 0,
      isShuffle,
      isRepeat,
      liked,
      playSong,
      togglePlay,
      playNext,
      playPrevious,
      seekTo,
      toggleShuffle,
      toggleRepeat,
      toggleLike,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      queue,
      currentSong,
      status.playing,
      status.isBuffering,
      status.currentTime,
      status.duration,
      isShuffle,
      isRepeat,
      liked,
    ]
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
