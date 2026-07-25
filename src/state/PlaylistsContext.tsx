import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockPlaylists } from '../data/songs';
import type { Playlist } from '../data/songs';

const STORAGE_KEY = 'deeptune.playlists.v1';

interface PlaylistsContextValue {
  playlists: Playlist[];
  isLoaded: boolean;
  createPlaylist: (name: string, songIds: string[]) => string;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  setPlaylistSongIds: (playlistId: string, songIds: string[]) => void;
}

const PlaylistsContext = createContext<PlaylistsContextValue | undefined>(undefined);

function makePlaylistId() {
  return `p${Math.random().toString(36).slice(2, 10)}`;
}

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Loads saved playlists once on startup. The first time the app ever runs
  // (nothing in storage yet), the built-in sample playlists are used as the
  // starting point so they remain editable just like anything the user creates.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        setPlaylists(raw ? (JSON.parse(raw) as Playlist[]) : mockPlaylists);
      })
      .catch(() => {
        setPlaylists(mockPlaylists);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  // Persists on every change, skipping the very first render before the
  // initial load above has run (which would otherwise overwrite storage with
  // an empty array).
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)).catch(() => {});
  }, [playlists, isLoaded]);

  function createPlaylist(name: string, songIds: string[]) {
    const id = makePlaylistId();
    setPlaylists((prev) => [...prev, { id, name, desc: 'Your playlist', songIds }]);
    return id;
  }

  function deletePlaylist(playlistId: string) {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }

  function addSongToPlaylist(playlistId: string, songId: string) {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId && !p.songIds.includes(songId) ? { ...p, songIds: [...p.songIds, songId] } : p))
    );
  }

  function removeSongFromPlaylist(playlistId: string, songId: string) {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p))
    );
  }

  function setPlaylistSongIds(playlistId: string, songIds: string[]) {
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, songIds } : p)));
  }

  const value = useMemo<PlaylistsContextValue>(
    () => ({
      playlists,
      isLoaded,
      createPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      setPlaylistSongIds,
    }),
    [playlists, isLoaded]
  );

  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
}

export function usePlaylists() {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) {
    throw new Error('usePlaylists must be used within a PlaylistsProvider');
  }
  return ctx;
}
