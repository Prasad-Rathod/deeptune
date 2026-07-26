import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs } from '../data/songs';
import { mockAlbums, mockArtists } from '../data/library';
import { usePlayer } from '../state/PlayerContext';
import { usePlaylists } from '../state/PlaylistsContext';
import { resolveLocalTrackUri, resolveLocalTrackAsSong, toLocalSongId } from '../services/localAudio';
import type { LocalTrack } from '../services/localAudio';
import { useLocalTracksContext } from '../state/LocalTracksContext';
import { extractEmbeddedArtworkUri } from '../services/albumArt';
import { PlusIcon, HeartIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import EmptyState from '../components/EmptyState';
import TrackActionsSheet from '../components/TrackActionsSheet';

type LibraryTab = 'playlists' | 'artists' | 'albums' | 'onDevice';
type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: LibraryTab; label: string }[] = [
  { key: 'playlists', label: 'PLAYLISTS' },
  { key: 'artists', label: 'ARTISTS' },
  { key: 'albums', label: 'ALBUMS' },
  { key: 'onDevice', label: 'ON DEVICE' },
];

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function OnDeviceTrackRow({
  track,
  onPress,
  onMorePress,
  isLoading,
}: {
  track: LocalTrack;
  onPress: () => void;
  onMorePress: () => void;
  isLoading?: boolean;
}) {
  const [artworkUrl, setArtworkUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    resolveLocalTrackUri(track.id).then((uri) => {
      extractEmbeddedArtworkUri(uri, track.id).then((art) => {
        if (!cancelled && art) setArtworkUrl(art);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [track.id]);

  return (
    <TrackRow
      title={track.title}
      subtitle="On this device"
      durationLabel={formatDuration(track.durationSec)}
      artworkUrl={artworkUrl}
      onPress={onPress}
      onMorePress={onMorePress}
      isLoading={isLoading}
    />
  );
}

function OnDeviceTab() {
  const { playSong } = usePlayer();
  const { status, tracks, retry } = useLocalTracksContext();
  const [sheetTrack, setSheetTrack] = useState<LocalTrack | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const playRequestId = useRef(0);

  async function playLocalTrack(track: LocalTrack) {
    // Resolve and play the tapped track immediately instead of re-resolving
    // every on-device track first — that made tapping any single song block
    // on a native URI lookup + artwork read for the whole library.
    const requestId = ++playRequestId.current;
    setLoadingTrackId(track.id);
    try {
      const song = await resolveLocalTrackAsSong(track);
      if (playRequestId.current !== requestId) return;
      playSong(song, [song]);
      setLoadingTrackId(null);

      // Fill in the rest of the queue (for next/previous) in the background
      // without delaying playback of the tapped track.
      const others = await Promise.all(
        tracks.filter((t) => t.id !== track.id).map(resolveLocalTrackAsSong)
      );
      if (playRequestId.current !== requestId) return;
      const fullQueue = tracks.map((t) =>
        t.id === track.id ? song : others.find((o) => o.id === toLocalSongId(t.id))!
      );
      playSong(song, fullQueue);
    } finally {
      if (playRequestId.current === requestId) setLoadingTrackId(null);
    }
  }

  if (status === 'loading') {
    return (
      <View style={styles.tabStateContainer}>
        <ActivityIndicator color={theme.colors.ink} size="large" />
      </View>
    );
  }

  if (status === 'unsupported') {
    return <EmptyState message="On-device music can't be scanned in this web preview — try it on your phone." />;
  }

  if (status === 'permission-denied') {
    return (
      <View style={styles.tabStateContainer}>
        <EmptyState message="Allow access to your device's audio files to see them here." />
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Grant access</Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'empty') {
    return <EmptyState message="No audio files found on this device." />;
  }

  return (
    <>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={tracks}
        keyExtractor={(track) => track.id}
        renderItem={({ item: track }) => (
          <OnDeviceTrackRow
            track={track}
            onPress={() => playLocalTrack(track)}
            onMorePress={() => setSheetTrack(track)}
            isLoading={loadingTrackId === track.id}
          />
        )}
      />
      <TrackActionsSheet
        visible={sheetTrack !== null}
        song={sheetTrack ? { id: toLocalSongId(sheetTrack.id), title: sheetTrack.title } : null}
        onClose={() => setSheetTrack(null)}
      />
    </>
  );
}

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNavigationProp>();
  const { liked } = usePlayer();
  const { playlists } = usePlaylists();
  const [activeTab, setActiveTab] = useState<LibraryTab>('playlists');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.lg }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Library</Text>
        <HardShadowBox
          offset={theme.shadow.sm}
          contentStyle={styles.addButton}
          onPress={() => navigation.navigate('CreatePlaylist')}
        >
          <PlusIcon size={20} color={theme.colors.ink} />
        </HardShadowBox>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.chip, activeTab === tab.key && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, activeTab === tab.key && styles.chipLabelActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {activeTab === 'playlists' && (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={playlists}
          keyExtractor={(playlist) => playlist.id}
          ListHeaderComponent={
            <Pressable
              style={styles.likedRow}
              onPress={() => navigation.navigate('PlaylistDetails', { playlistId: 'liked' })}
            >
              <View style={styles.likedArtwork}>
                <HeartIcon size={24} color={theme.colors.paper} filled />
              </View>
              <View style={styles.likedInfo}>
                <Text style={styles.likedTitle}>Liked Songs</Text>
                <Text style={styles.likedSubtitle}>Playlist · {liked.size} songs</Text>
              </View>
            </Pressable>
          }
          renderItem={({ item: playlist }) => (
            <TrackRow
              title={playlist.name}
              subtitle={`Playlist · ${playlist.songIds.length} songs`}
              artworkUrl={mockSongs.find((s) => s.id === playlist.songIds[0])?.artworkUrl}
              onPress={() => navigation.navigate('PlaylistDetails', { playlistId: playlist.id })}
            />
          )}
        />
      )}

      {activeTab === 'artists' && (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={mockArtists}
          keyExtractor={(artist) => artist.id}
          renderItem={({ item: artist }) => (
            <TrackRow title={artist.name} subtitle={`${mockSongs.filter((s) => s.artist === artist.name).length} songs`} />
          )}
        />
      )}

      {activeTab === 'albums' && (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={mockAlbums}
          keyExtractor={(album) => album.id}
          renderItem={({ item: album }) => <TrackRow title={album.name} subtitle={album.artist} />}
        />
      )}

      {activeTab === 'onDevice' && <OnDeviceTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.page,
    marginBottom: 20,
  },
  title: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.h1, color: theme.colors.ink },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: { flexGrow: 0 },
  chipsRow: { gap: 9, alignItems: 'flex-start', paddingHorizontal: theme.spacing.page, paddingBottom: theme.spacing.lg },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    backgroundColor: 'transparent',
  },
  chipActive: { backgroundColor: theme.colors.ink },
  chipLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    color: theme.colors.ink,
  },
  chipLabelActive: { color: theme.colors.paper },
  list: { flex: 1 },
  tabStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
  retryButton: {
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.ink,
  },
  retryLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  listContent: { paddingBottom: 176 },
  likedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.page,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inkBorderFaint,
  },
  likedArtwork: {
    width: 48,
    height: 48,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedInfo: { flex: 1 },
  likedTitle: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.h3 },
  likedSubtitle: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    marginTop: 2,
  },
});
