import { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs, recentlyPlayed } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import { usePlaylists } from '../state/PlaylistsContext';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import Artwork from '../components/Artwork';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function useGreeting() {
  return useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good\nmorning.' : hour < 18 ? 'Good\nafternoon.' : 'Good\nevening.';
  }, []);
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { currentSong, playSong } = usePlayer();
  const { playlists } = usePlaylists();
  const greeting = useGreeting();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.avatar}>
          <Text style={styles.avatarLetter}>P</Text>
        </Pressable>
      </View>

      <View style={styles.quickGrid}>
        {mockSongs.slice(0, 6).map((song) => (
          <HardShadowBox
            key={song.id}
            offset={theme.shadow.sm}
            style={styles.quickItemWrapper}
            contentStyle={styles.quickItemContent}
            onPress={() => {
              playSong(song, mockSongs);
              navigation.navigate('Player');
            }}
          >
            <Artwork uri={song.artworkUrl} style={styles.quickArtwork} />
            <Text style={styles.quickTitle} numberOfLines={1}>
              {song.title}
            </Text>
          </HardShadowBox>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Made for you</Text>
          <View style={styles.sectionRule} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {playlists.map((playlist) => (
            <Pressable
              key={playlist.id}
              style={styles.playlistCard}
              onPress={() => navigation.navigate('PlaylistDetails', { playlistId: playlist.id })}
            >
              <HardShadowBox contentStyle={styles.playlistCover}>
                <Artwork
                  uri={mockSongs.find((s) => s.id === playlist.songIds[0])?.artworkUrl}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.trackCountTag}>
                  <Text style={styles.trackCountText}>{playlist.songIds.length} TRK</Text>
                </View>
              </HardShadowBox>
              <Text style={styles.playlistName} numberOfLines={1}>
                {playlist.name}
              </Text>
              <Text style={styles.playlistDesc} numberOfLines={1}>
                {playlist.desc}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>On the turntable</Text>
          <View style={styles.sectionRule} />
        </View>
        {recentlyPlayed.map((song) => (
          <TrackRow
            key={song.id}
            title={song.title}
            subtitle={song.artist}
            durationLabel={formatDuration(song.durationSec)}
            artworkUrl={song.artworkUrl}
            isPlayingNow={currentSong?.id === song.id}
            onPress={() => playSong(song, recentlyPlayed)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  content: { paddingBottom: 176, gap: theme.spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.page,
  },
  greeting: {
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.displayLg,
    color: theme.colors.ink,
    lineHeight: 36,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: theme.colors.paper,
    fontFamily: theme.fonts.display.bold,
    fontSize: theme.typography.sizes.h3,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
    paddingHorizontal: theme.spacing.page,
  },
  quickItemWrapper: { width: '47%' },
  quickItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: theme.colors.paperLight,
    padding: 8,
  },
  quickArtwork: {
    width: 42,
    height: 42,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.paper,
  },
  quickTitle: {
    flex: 1,
    fontFamily: theme.fonts.display.bold,
    fontSize: theme.typography.sizes.body,
  },
  section: { gap: 15 },
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
  carousel: { gap: 16, paddingHorizontal: theme.spacing.page, paddingBottom: 8 },
  playlistCard: { width: 158, gap: 11 },
  playlistCover: { width: 158, height: 158, backgroundColor: theme.colors.paperLight, position: 'relative' },
  trackCountTag: {
    position: 'absolute',
    left: -1.5,
    top: 12,
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    borderLeftWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trackCountText: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  playlistName: {
    fontFamily: theme.fonts.display.bold,
    fontSize: theme.typography.sizes.title,
  },
  playlistDesc: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    marginTop: -6,
  },
});
