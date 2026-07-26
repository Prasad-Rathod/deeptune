import { Pressable, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import Artwork from './Artwork';
import { MoreDotsIcon } from './icons';

interface TrackRowProps {
  title: string;
  subtitle: string;
  durationLabel?: string;
  position?: number;
  isActive?: boolean;
  isPlayingNow?: boolean;
  artworkUrl?: string;
  onPress?: () => void;
  onMorePress?: () => void;
}

export default function TrackRow({
  title,
  subtitle,
  durationLabel,
  position,
  isActive,
  isPlayingNow,
  artworkUrl,
  onPress,
  onMorePress,
}: TrackRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      {position !== undefined && (
        <Text style={[styles.position, isActive && styles.positionActive]}>{position}</Text>
      )}
      <Artwork uri={artworkUrl} style={styles.artwork}>
        {isPlayingNow && (
          <View style={styles.eqOverlay}>
            <View style={styles.eqBar} />
            <View style={[styles.eqBar, styles.eqBarTall]} />
            <View style={styles.eqBar} />
          </View>
        )}
      </Artwork>
      <View style={styles.info}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {durationLabel && <Text style={styles.duration}>{durationLabel}</Text>}
      {onMorePress && (
        <Pressable onPress={onMorePress} hitSlop={10} style={styles.moreButton}>
          <MoreDotsIcon size={18} color={theme.colors.inkFaint} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.page,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inkBorderFaint,
  },
  position: {
    width: 16,
    textAlign: 'center',
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFainter,
  },
  positionActive: { color: theme.colors.accent },
  artwork: {
    width: 48,
    height: 48,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.paperLight,
    position: 'relative',
    overflow: 'hidden',
  },
  eqOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 23, 24, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
  },
  eqBar: {
    width: 3,
    height: 12,
    backgroundColor: theme.colors.paper,
  },
  eqBarTall: {
    height: 18,
  },
  info: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: theme.fonts.display.bold,
    fontSize: theme.typography.sizes.title,
    color: theme.colors.ink,
  },
  titleActive: { color: theme.colors.accent },
  subtitle: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    marginTop: 2,
  },
  duration: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFainter,
  },
  moreButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
