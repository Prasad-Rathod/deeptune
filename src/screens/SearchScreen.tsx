import { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockGenres } from '../data/genres';
import { mockSongs } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import { useLocalTracksContext } from '../state/LocalTracksContext';
import { resolveLocalTrackAsSong, toLocalSongId } from '../services/localAudio';
import { SearchIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import EmptyState from '../components/EmptyState';
import TrackActionsSheet from '../components/TrackActionsSheet';
import type { TrackActionsSheetSong } from '../components/TrackActionsSheet';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl?: string;
  isLocal: boolean;
}

export default function SearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const [query, setQuery] = useState('');
  const [sheetSong, setSheetSong] = useState<TrackActionsSheetSong | null>(null);
  const insets = useSafeAreaInsets();
  const { playSong } = usePlayer();
  const { tracks: localTracks } = useLocalTracksContext();

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const fromMock: SearchResult[] = mockSongs
      .filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
      .map((s) => ({ id: s.id, title: s.title, subtitle: s.artist, artworkUrl: s.artworkUrl, isLocal: false }));

    const fromLocal: SearchResult[] = localTracks
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((t) => ({ id: toLocalSongId(t.id), title: t.title, subtitle: 'On this device', isLocal: true }));

    return [...fromMock, ...fromLocal];
  }, [query, localTracks]);

  const hasQuery = query.trim().length > 0;

  async function handleResultPress(result: SearchResult) {
    if (result.isLocal) {
      const track = localTracks.find((t) => toLocalSongId(t.id) === result.id);
      if (!track) return;
      const song = await resolveLocalTrackAsSong(track);
      playSong(song, [song]);
    } else {
      const song = mockSongs.find((s) => s.id === result.id);
      if (!song) return;
      playSong(song, mockSongs);
    }
    navigation.navigate('Player');
  }

  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Search</Text>
        <HardShadowBox contentStyle={styles.searchBar}>
          <SearchIcon size={19} color={theme.colors.ink} strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Songs, artists, moods"
            placeholderTextColor={theme.colors.inkFaint}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
        </HardShadowBox>
      </View>

      {!hasQuery && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Browse the racks</Text>
            <View style={styles.sectionRule} />
          </View>
          <View style={styles.genreGrid}>
            {mockGenres.map((genre) => (
              <HardShadowBox key={genre.id} style={styles.genreTileWrapper} contentStyle={styles.genreTile}>
                <View style={styles.genreLabelStrip}>
                  <Text style={styles.genreLabel}>{genre.name}</Text>
                </View>
              </HardShadowBox>
            ))}
          </View>
        </View>
      )}

      {hasQuery && results.length === 0 && <EmptyState message={`No results for "${query}"`} />}

      {hasQuery && results.length > 0 && (
        <View style={styles.resultsBlock}>
          <Text style={styles.resultLabel}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
          {results.map((result) => (
            <TrackRow
              key={result.id}
              title={result.title}
              subtitle={result.subtitle}
              artworkUrl={result.artworkUrl}
              onPress={() => handleResultPress(result)}
              onMorePress={() => setSheetSong({ id: result.id, title: result.title })}
            />
          ))}
        </View>
      )}
    </ScrollView>
    <TrackActionsSheet visible={sheetSong !== null} song={sheetSong} onClose={() => setSheetSong(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  content: { paddingBottom: 176, gap: theme.spacing.xl },
  headerBlock: { paddingHorizontal: theme.spacing.page },
  title: {
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.h1,
    marginBottom: 16,
    color: theme.colors.ink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: theme.colors.paperLight,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    color: theme.colors.ink,
    fontFamily: theme.fonts.display.semibold,
    fontSize: theme.typography.sizes.bodyLg,
  },
  resultsBlock: { gap: 0 },
  resultLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.inkFaint,
    paddingHorizontal: theme.spacing.page,
    marginBottom: 10,
  },
  section: { gap: 14 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.page,
  },
  sectionLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionRule: { flex: 1, height: 1.5, backgroundColor: theme.colors.ink },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: theme.spacing.page,
  },
  genreTileWrapper: { width: '47%' },
  genreTile: {
    height: 100,
    backgroundColor: theme.colors.paperLight,
    position: 'relative',
    overflow: 'hidden',
  },
  genreLabelStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.paper,
    borderTopWidth: theme.borderWidth,
    borderTopColor: theme.colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genreLabel: {
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.bodyLg,
  },
});
