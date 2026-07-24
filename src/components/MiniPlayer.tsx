import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { theme } from '../theme';
import { PlayIcon, PauseIcon } from './icons';
import HardShadowBox from './HardShadowBox';

interface MiniPlayerProps {
  title: string;
  artist: string;
  isPlaying: boolean;
  progressPct: number;
  onTogglePlay: () => void;
  onPress: () => void;
}

export default function MiniPlayer({
  title,
  artist,
  isPlaying,
  progressPct,
  onTogglePlay,
  onPress,
}: MiniPlayerProps) {
  return (
    <HardShadowBox onPress={onPress} shadowColor="rgba(23, 23, 24, 0.35)" contentStyle={styles.content}>
      <View style={styles.row}>
        <View style={styles.artwork} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
        </View>
        <Pressable
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            onTogglePlay();
          }}
          hitSlop={12}
          style={styles.playButton}
        >
          {isPlaying ? (
            <PauseIcon size={18} color={theme.colors.paper} />
          ) : (
            <PlayIcon size={18} color={theme.colors.paper} />
          )}
        </Pressable>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.ink,
    paddingVertical: 9,
    paddingHorizontal: 11,
    position: 'relative',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  artwork: {
    width: 42,
    height: 42,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.paper,
    backgroundColor: theme.colors.paperLight,
  },
  info: { flex: 1 },
  title: {
    color: theme.colors.paper,
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.fonts.display.bold,
  },
  artist: {
    color: 'rgba(241, 240, 234, 0.6)',
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    marginTop: 2,
  },
  playButton: {
    width: 40,
    height: 40,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: 'rgba(241, 240, 234, 0.22)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.paper,
  },
});
