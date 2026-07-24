import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { usePlayer } from '../state/PlayerContext';
import Button from '../components/Button';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayer();

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <Text style={styles.songTitle}>Nothing playing yet</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{currentSong.title}</Text>
      <Text style={styles.songArtist}>{currentSong.artist}</Text>

      <View style={styles.controls}>
        <Button label="Previous" variant="secondary" onPress={playPrevious} />
        <Button label={isPlaying ? 'Pause' : 'Play'} onPress={togglePlay} />
        <Button label="Next" variant="secondary" onPress={playNext} />
      </View>

      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  songTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  songArtist: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  closeButton: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 8,
  },
  closeText: { color: theme.colors.textPrimary, fontWeight: '600' },
});
