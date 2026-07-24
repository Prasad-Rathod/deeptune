import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs, mockPlaylists } from '../data/songs';
import { mockAlbums, mockArtists } from '../data/library';
import { usePlayer } from '../state/PlayerContext';
import Header from '../components/Header';
import SongRow from '../components/SongRow';

type LibraryTab = 'songs' | 'albums' | 'artists' | 'playlists';
type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: LibraryTab; label: string }[] = [
  { key: 'songs', label: 'Songs' },
  { key: 'albums', label: 'Albums' },
  { key: 'artists', label: 'Artists' },
  { key: 'playlists', label: 'Playlists' },
];

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNavigationProp>();
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<LibraryTab>('songs');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Library" />

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tabChip, activeTab === tab.key && styles.tabChipActive]}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      ) : activeTab === 'songs' ? (
        <FlatList
          style={styles.list}
          data={mockSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongRow title={item.title} artist={item.artist} onPress={() => playSong(item, mockSongs)} />
          )}
        />
      ) : activeTab === 'albums' ? (
        <FlatList
          style={styles.list}
          data={mockAlbums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongRow title={item.name} artist={item.artist} />}
        />
      ) : activeTab === 'artists' ? (
        <FlatList
          style={styles.list}
          data={mockArtists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongRow
              title={item.name}
              artist={`${mockSongs.filter((s) => s.artist === item.name).length} songs`}
            />
          )}
        />
      ) : (
        <FlatList
          style={styles.list}
          data={mockPlaylists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongRow
              title={item.name}
              artist={`${item.songIds.length} songs`}
              onPress={() => navigation.navigate('PlaylistDetails', { playlistId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tabChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  tabLabelActive: {
    color: theme.colors.textPrimary,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { flex: 1, paddingHorizontal: theme.spacing.md },
});
