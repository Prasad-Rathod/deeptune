import { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { mockSongs } from '../data/songs';
import { mockGenres } from '../data/genres';
import { usePlayer } from '../state/PlayerContext';
import { SearchIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { playSong } = usePlayer();

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return mockSongs.filter(
      (song) => song.title.toLowerCase().includes(trimmed) || song.artist.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      {hasQuery ? (
        <View style={styles.resultsBlock}>
          <Text style={styles.resultLabel}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
          {results.map((song) => (
            <TrackRow
              key={song.id}
              title={song.title}
              subtitle={`Song · ${song.artist}`}
              onPress={() => playSong(song, results)}
            />
          ))}
        </View>
      ) : (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  content: { paddingTop: theme.spacing.xl, paddingBottom: 176, gap: theme.spacing.xl },
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
