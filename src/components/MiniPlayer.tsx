import { Pressable, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface MiniPlayerProps {
  title: string;
  artist: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPress?: () => void;
}

export default function MiniPlayer({ title, artist, isPlaying, onTogglePlay, onPress }: MiniPlayerProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
      </View>
      <Pressable onPress={onTogglePlay} hitSlop={12} style={styles.playButton}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: theme.spacing.md,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  info: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  artist: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.xs,
  },
  playButton: {
    padding: theme.spacing.xs,
  },
  playIcon: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.lg,
  },
});
