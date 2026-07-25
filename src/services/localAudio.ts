import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AssetField, MediaType, Query, Asset, requestPermissionsAsync } from 'expo-media-library';

export interface LocalTrack {
  id: string;
  title: string;
  durationSec: number;
}

export type LocalTracksStatus = 'loading' | 'unsupported' | 'permission-denied' | 'empty' | 'success';

function stripExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

export function useLocalTracks() {
  const [status, setStatus] = useState<LocalTracksStatus>('loading');
  const [tracks, setTracks] = useState<LocalTrack[]>([]);

  const load = useCallback(async () => {
    // expo-media-library's on-device query API is native-only — a browser has
    // no equivalent way to scan arbitrary device storage, so this is one
    // feature that genuinely can't be verified in the web preview.
    if (Platform.OS === 'web') {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    const permission = await requestPermissionsAsync(false, ['audio']);
    if (!permission.granted) {
      setStatus('permission-denied');
      return;
    }

    const results = await new Query()
      .eq(AssetField.MEDIA_TYPE, MediaType.AUDIO)
      .orderBy(AssetField.MODIFICATION_TIME)
      .exeForMetadata();

    const mapped: LocalTrack[] = results.map((asset) => ({
      id: asset.id,
      title: asset.filename ? stripExtension(asset.filename) : 'Unknown track',
      durationSec: asset.duration ? asset.duration / 1000 : 0,
    }));

    // Some devices index the same physical file twice in MediaStore (e.g. once
    // under "Music" and once under "Download"), giving two different asset ids
    // for identical title+duration. Keep only the first of each.
    const seen = new Set<string>();
    const deduped = mapped.filter((track) => {
      const key = `${track.title}|${track.durationSec}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setTracks(deduped);
    setStatus(deduped.length === 0 ? 'empty' : 'success');
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, tracks, retry: load };
}

export function resolveLocalTrackUri(id: string): Promise<string> {
  return new Asset(id).getUri();
}
