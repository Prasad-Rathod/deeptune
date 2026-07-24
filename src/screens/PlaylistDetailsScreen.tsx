import { View, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs, mockPlaylists } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import SongRow from '../components/SongRow';

type PlaylistDetailsRouteProp = RouteProp<RootStackParamList, 'PlaylistDetails'>;

export default function PlaylistDetailsScreen() {
  const route = useRoute<PlaylistDetailsRouteProp>();
  const { playSong } = usePlayer();
  const playlist = mockPlaylists.find((p) => p.id === route.params.playlistId);

  if (!playlist) return null;

  const songs = playlist.songIds
    .map((id) => mockSongs.find((s) => s.id === id))
    .filter((song): song is (typeof mockSongs)[number] => Boolean(song));

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongRow title={item.title} artist={item.artist} onPress={() => playSong(item, songs)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { flex: 1, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
});
