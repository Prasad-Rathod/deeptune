import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalTracks } from '../services/localAudio';
import type { LocalTrack, LocalTracksStatus } from '../services/localAudio';

interface LocalTracksContextValue {
  status: LocalTracksStatus;
  tracks: LocalTrack[];
  retry: () => void;
}

const LocalTracksContext = createContext<LocalTracksContextValue | undefined>(undefined);

// Scans the device's audio library once at the app root so every screen that
// needs on-device tracks (Library, Search, Create Playlist, Playlist Details)
// shares one scan instead of each re-querying expo-media-library.
export function LocalTracksProvider({ children }: { children: ReactNode }) {
  const value = useLocalTracks();
  return <LocalTracksContext.Provider value={value}>{children}</LocalTracksContext.Provider>;
}

export function useLocalTracksContext() {
  const ctx = useContext(LocalTracksContext);
  if (!ctx) {
    throw new Error('useLocalTracksContext must be used within a LocalTracksProvider');
  }
  return ctx;
}
