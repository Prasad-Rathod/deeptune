import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs } from '../data/songs';
import type { Song } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import { usePlaylists } from '../state/PlaylistsContext';
import { useLocalTracksContext } from '../state/LocalTracksContext';
import { isLocalSongId, toLocalSongId, resolveLocalTrackAsSong } from '../services/localAudio';
import { ChevronLeftIcon, PlayIcon, ShuffleIcon, PlusIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import Artwork from '../components/Artwork';
import TrackActionsSheet from '../components/TrackActionsSheet';

type PlaylistDetailsRouteProp = RouteProp<RootStackParamList, 'PlaylistDetails'>;
type PlaylistDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlaylistDetailsScreen() {
  const route = useRoute<PlaylistDetailsRouteProp>();
  const navigation = useNavigation<PlaylistDetailsNavigationProp>();
  const { currentSong, liked, playSong } = usePlayer();
  const { playlists } = usePlaylists();
  const { tracks: localTracks } = useLocalTracksContext();
  const { playlistId } = route.params;
  const insets = useSafeAreaInsets();

  const isLiked = playlistId === 'liked';
  const playlist = isLiked ? null : playlists.find((p) => p.id === playlistId);

  const [songs, setSongs] = useState<Song[]>([]);
  const [resolving, setResolving] = useState(true);
  const [sheetSong, setSheetSong] = useState<Song | null>(null);

  const songIds = isLiked ? Array.from(liked) : (playlist?.songIds ?? []);

  useEffect(() => {
    let cancelled = false;

    async function resolveSongs() {
      setResolving(true);
      const resolved = await Promise.all(
        songIds.map(async (id): Promise<Song | null> => {
          if (isLocalSongId(id)) {
            const track = localTracks.find((t) => toLocalSongId(t.id) === id);
            return track ? resolveLocalTrackAsSong(track) : null;
          }
          return mockSongs.find((s) => s.id === id) ?? null;
        })
      );
      if (!cancelled) {
        setSongs(resolved.filter((song): song is Song => Boolean(song)));
        setResolving(false);
      }
    }

    resolveSongs();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIds.join('|'), localTracks]);

  if (!isLiked && !playlist) return null;

  const name = isLiked ? 'Liked Songs' : playlist!.name;
  const desc = isLiked ? "Songs you've liked" : playlist!.desc;

  if (resolving) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top + theme.spacing.lg }]}>
        <ActivityIndicator color={theme.colors.ink} size="large" />
      </View>
    );
  }

  return (
    <>
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={songs}
      keyExtractor={(song) => song.id}
      ListHeaderComponent={
        <View style={[styles.headerBlock, { paddingTop: insets.top + theme.spacing.lg }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
            <ChevronLeftIcon size={16} />
            <Text style={styles.backLabel}>Library</Text>
          </Pressable>

          <View style={styles.coverRow}>
            <HardShadowBox offset={theme.shadow.lg} contentStyle={styles.cover}>
              <Artwork uri={songs[0]?.artworkUrl} style={StyleSheet.absoluteFill} />
            </HardShadowBox>
            <View style={styles.titleBlock}>
              <Text style={styles.kicker}>Playlist</Text>
              <Text style={styles.name}>{name}</Text>
            </View>
          </View>

          <Text style={styles.desc}>
            {desc} · {songs.length} songs
          </Text>

          <View style={styles.actionsRow}>
            <HardShadowBox
              style={styles.playAllWrapper}
              contentStyle={styles.playAll}
              onPress={() => {
                if (songs.length === 0) return;
                playSong(songs[0], songs);
                navigation.navigate('Player');
              }}
            >
              <PlayIcon size={18} color={theme.colors.ink} />
              <Text style={styles.playAllLabel}>PLAY ALL</Text>
            </HardShadowBox>
            <HardShadowBox contentStyle={styles.iconButton}>
              <ShuffleIcon size={22} />
            </HardShadowBox>
            {!isLiked && (
              <HardShadowBox
                contentStyle={styles.iconButton}
                onPress={() => navigation.navigate('CreatePlaylist', { playlistId: playlist!.id })}
              >
                <PlusIcon size={20} />
              </HardShadowBox>
            )}
          </View>
        </View>
      }
      renderItem={({ item: song, index }) => (
        <TrackRow
          position={index + 1}
          title={song.title}
          subtitle={song.artist}
          artworkUrl={song.artworkUrl}
          isActive={currentSong?.id === song.id}
          isPlayingNow={currentSong?.id === song.id}
          onPress={() => playSong(song, songs)}
          onMorePress={() => setSheetSong(song)}
        />
      )}
    />
    <TrackActionsSheet
      visible={sheetSong !== null}
      song={sheetSong}
      playlistId={!isLiked ? playlistId : undefined}
      onClose={() => setSheetSong(null)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  loadingContainer: { flex: 1, backgroundColor: theme.colors.paper, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 176 },
  headerBlock: { gap: 16, paddingHorizontal: theme.spacing.page, marginBottom: 6 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  coverRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  cover: { width: 132, height: 132, backgroundColor: theme.colors.paperLight },
  titleBlock: { paddingBottom: 4, flexShrink: 1 },
  kicker: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.inkFaint,
  },
  name: {
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.display,
    lineHeight: 30,
    marginTop: 6,
  },
  desc: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
  },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  playAllWrapper: { flex: 1 },
  playAll: {
    height: 50,
    backgroundColor: theme.colors.paperLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  playAllLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.title,
    letterSpacing: 0.4,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
