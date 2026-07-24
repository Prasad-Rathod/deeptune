import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, Platform, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { usePlayer } from '../state/PlayerContext';
import {
  ChevronDownIcon,
  MoreDotsIcon,
  HeartIcon,
  ShuffleIcon,
  RepeatIcon,
  PrevIcon,
  PlayIcon,
  PauseIcon,
  NextIcon,
  CastIcon,
} from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();
  const [artworkSize, setArtworkSize] = useState(0);

  function handleArtworkWrapperLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    const availableHeight = height - 40; // artworkWrapper's own paddingVertical (20 top + 20 bottom)
    setArtworkSize(Math.min(width, availableHeight));
  }

  const {
    currentSong,
    isPlaying,
    progressSec,
    isShuffle,
    isRepeat,
    liked,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isPlaying) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isPlaying, spin]);

  if (!currentSong) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nothing playing yet</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.emptyClose}>
          <Text style={styles.emptyCloseText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  const vinylSize = artworkSize * 0.22;
  const vinylInset = artworkSize * 0.045;
  const vinylHoleSize = vinylSize * 0.2;

  const isLiked = liked.has(currentSong.id);
  const progressPct = Math.min(100, (progressSec / currentSong.durationSec) * 100);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.topButton} onPress={() => navigation.goBack()}>
          <ChevronDownIcon size={22} />
        </HardShadowBox>
        <View style={styles.topCenter}>
          <Text style={styles.topLabel}>Now playing</Text>
          <Text style={styles.topArtist}>{currentSong.artist}</Text>
        </View>
        <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.topButton}>
          <MoreDotsIcon size={20} />
        </HardShadowBox>
      </View>

      <View style={styles.artworkWrapper} onLayout={handleArtworkWrapperLayout}>
        {artworkSize > 0 && (
          <HardShadowBox
            offset={theme.shadow.xl}
            style={{ width: artworkSize, height: artworkSize }}
            contentStyle={[styles.artwork, { width: artworkSize, height: artworkSize }]}
          >
            {isPlaying && (
              <Animated.View
                style={[
                  styles.vinyl,
                  {
                    width: vinylSize,
                    height: vinylSize,
                    borderRadius: vinylSize / 2,
                    left: artworkSize - vinylInset - vinylSize,
                    top: artworkSize - vinylInset - vinylSize,
                    transform: [{ rotate }],
                  },
                ]}
              >
                <View style={[styles.vinylHole, { width: vinylHoleSize, height: vinylHoleSize, borderRadius: vinylHoleSize / 2 }]} />
              </Animated.View>
            )}
          </HardShadowBox>
        )}
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist}>{currentSong.artist}</Text>
        </View>
        <HardShadowBox
          offset={theme.shadow.sm}
          contentStyle={[styles.likeButton, isLiked && styles.likeButtonActive]}
          onPress={() => toggleLike(currentSong.id)}
        >
          <HeartIcon size={22} color={isLiked ? theme.colors.paper : theme.colors.ink} filled={isLiked} />
        </HardShadowBox>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>{formatDuration(progressSec)}</Text>
          <Text style={styles.progressText}>-{formatDuration(Math.max(0, currentSong.durationSec - progressSec))}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <Pressable onPress={toggleShuffle} hitSlop={10} style={[styles.sideControl, { opacity: isShuffle ? 1 : 0.35 }]}>
          <ShuffleIcon size={24} />
        </Pressable>
        <Pressable onPress={playPrevious} hitSlop={6} style={styles.transportControl}>
          <PrevIcon size={30} />
        </Pressable>
        <HardShadowBox offset={theme.shadow.lg} radius={999} contentStyle={styles.playButton} onPress={togglePlay}>
          {isPlaying ? (
            <PauseIcon size={30} color={theme.colors.ink} />
          ) : (
            <PlayIcon size={32} color={theme.colors.ink} />
          )}
        </HardShadowBox>
        <Pressable onPress={playNext} hitSlop={6} style={styles.transportControl}>
          <NextIcon size={30} />
        </Pressable>
        <Pressable onPress={toggleRepeat} hitSlop={10} style={[styles.sideControl, { opacity: isRepeat ? 1 : 0.35 }]}>
          <RepeatIcon size={24} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <CastIcon size={15} />
        <Text style={styles.footerText}>Living Room · AirPlay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.paper,
    paddingHorizontal: theme.spacing.page,
    paddingTop: 54,
    paddingBottom: 40,
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: theme.colors.paper },
  emptyText: { fontFamily: theme.fonts.display.bold, fontSize: theme.typography.sizes.h2 },
  emptyClose: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.ink,
    borderRadius: 8,
  },
  emptyCloseText: { color: theme.colors.paper, fontFamily: theme.fonts.display.semibold },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCenter: { alignItems: 'center' },
  topLabel: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.label,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.inkFaint,
  },
  topArtist: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.body, marginTop: 2 },
  artworkWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  artwork: {
    backgroundColor: theme.colors.paperLight,
    position: 'relative',
    overflow: 'hidden',
  },
  vinyl: {
    position: 'absolute',
    backgroundColor: theme.colors.ink,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylHole: {
    backgroundColor: theme.colors.paper,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 22 },
  titleBlock: { flexShrink: 1, minWidth: 0 },
  title: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.display, lineHeight: 32 },
  artist: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.inkFaint,
    marginTop: 6,
  },
  likeButton: {
    width: 46,
    height: 46,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButtonActive: { backgroundColor: theme.colors.ink },
  progressBlock: { marginBottom: 22 },
  progressTrack: { height: 6, borderWidth: theme.borderWidth, borderColor: theme.colors.ink, backgroundColor: theme.colors.paper },
  progressFill: { height: '100%', backgroundColor: theme.colors.ink },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { fontFamily: theme.fonts.mono.regular, fontSize: theme.typography.sizes.meta, color: theme.colors.inkFaint },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sideControl: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  transportControl: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  playButton: {
    width: 78,
    height: 78,
    borderRadius: 999,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  footerText: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.inkFaint,
  },
});
