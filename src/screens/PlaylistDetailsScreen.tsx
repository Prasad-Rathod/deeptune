import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs, mockPlaylists } from '../data/songs';
import type { Song } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import { ChevronLeftIcon, PlayIcon, ShuffleIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import TrackRow from '../components/TrackRow';
import Artwork from '../components/Artwork';

type PlaylistDetailsRouteProp = RouteProp<RootStackParamList, 'PlaylistDetails'>;
type PlaylistDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlaylistDetailsScreen() {
  const route = useRoute<PlaylistDetailsRouteProp>();
  const navigation = useNavigation<PlaylistDetailsNavigationProp>();
  const { currentSong, liked, playSong } = usePlayer();
  const { playlistId } = route.params;

  const isLiked = playlistId === 'liked';
  const playlist = isLiked ? null : mockPlaylists.find((p) => p.id === playlistId);

  if (!isLiked && !playlist) return null;

  const songs: Song[] = isLiked
    ? mockSongs.filter((s) => liked.has(s.id))
    : (playlist!.songIds
        .map((id) => mockSongs.find((s) => s.id === id))
        .filter((song): song is Song => Boolean(song)));

  const name = isLiked ? 'Liked Songs' : playlist!.name;
  const desc = isLiked ? "Songs you've liked" : playlist!.desc;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBlock}>
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
        </View>
      </View>

      <View>
        {songs.map((song, index) => (
          <TrackRow
            key={song.id}
            position={index + 1}
            title={song.title}
            subtitle={song.artist}
            artworkUrl={song.artworkUrl}
            isActive={currentSong?.id === song.id}
            isPlayingNow={currentSong?.id === song.id}
            onPress={() => playSong(song, songs)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  content: { paddingBottom: 176 },
  headerBlock: { gap: 16, paddingHorizontal: theme.spacing.page, paddingTop: theme.spacing.lg, marginBottom: 6 },
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
