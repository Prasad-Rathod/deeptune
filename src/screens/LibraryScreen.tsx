import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs, mockPlaylists } from '../data/songs';
import { mockAlbums, mockArtists } from '../data/library';
import { usePlayer } from '../state/PlayerContext';
import { PlusIcon, HeartIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import EmptyState from '../components/EmptyState';

type LibraryTab = 'playlists' | 'artists' | 'albums' | 'downloaded';
type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: LibraryTab; label: string }[] = [
  { key: 'playlists', label: 'PLAYLISTS' },
  { key: 'artists', label: 'ARTISTS' },
  { key: 'albums', label: 'ALBUMS' },
  { key: 'downloaded', label: 'DOWNLOADED' },
];

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNavigationProp>();
  const { liked } = usePlayer();
  const [activeTab, setActiveTab] = useState<LibraryTab>('playlists');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Library</Text>
        <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.addButton}>
          <PlusIcon size={20} color={theme.colors.ink} />
        </HardShadowBox>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.ink} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {activeTab === 'playlists' && (
            <>
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
              {mockPlaylists.map((playlist) => (
                <TrackRow
                  key={playlist.id}
                  title={playlist.name}
                  subtitle={`Playlist · ${playlist.songIds.length} songs`}
                  onPress={() => navigation.navigate('PlaylistDetails', { playlistId: playlist.id })}
                />
              ))}
            </>
          )}

          {activeTab === 'artists' &&
            mockArtists.map((artist) => (
              <TrackRow
                key={artist.id}
                title={artist.name}
                subtitle={`${mockSongs.filter((s) => s.artist === artist.name).length} songs`}
              />
            ))}

          {activeTab === 'albums' &&
            mockAlbums.map((album) => <TrackRow key={album.id} title={album.name} subtitle={album.artist} />)}

          {activeTab === 'downloaded' && <EmptyState message="No downloaded songs yet" />}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper, paddingTop: theme.spacing.xl },
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
  chipsRow: { gap: 9, paddingHorizontal: theme.spacing.page, paddingBottom: theme.spacing.lg },
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: 176 },
  likedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.page,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inkBorderFaint,
  },
  likedArtwork: {
    width: 54,
    height: 54,
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
