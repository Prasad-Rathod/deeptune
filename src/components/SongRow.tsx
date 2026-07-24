import { Pressable, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SongRowProps {
  title: string;
  artist: string;
  onPress?: () => void;
}

export default function SongRow({ title, artist, onPress }: SongRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  info: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  artist: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    marginTop: 2,
  },
});
