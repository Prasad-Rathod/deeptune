import { useMemo, useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { mockSongs } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import SongRow from '../components/SongRow';
import EmptyState from '../components/EmptyState';

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search songs or artists"
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />

      {query.trim() === '' ? (
        <EmptyState message="Search for a song or artist" />
      ) : results.length === 0 ? (
        <EmptyState message={`No results for "${query}"`} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongRow title={item.title} artist={item.artist} onPress={() => playSong(item, results)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.md,
  },
});
