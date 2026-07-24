import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { recentlyPlayed } from '../data/songs';
import type { Song } from '../data/songs';
import { usePlayer } from '../state/PlayerContext';
import Header from '../components/Header';
import SongRow from '../components/SongRow';
import MiniPlayer from '../components/MiniPlayer';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  return (
    <View style={styles.container}>
      <Header title="Home" />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <FlatList
          style={styles.list}
          data={recentlyPlayed}
          keyExtractor={(item: Song) => item.id}
          renderItem={({ item }) => (
            <SongRow
              title={item.title}
              artist={item.artist}
              onPress={() => playSong(item, recentlyPlayed)}
            />
          )}
        />
      </View>

      {currentSong && (
        <View style={styles.miniPlayerWrapper}>
          <MiniPlayer
            title={currentSong.title}
            artist={currentSong.artist}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onPress={() => navigation.navigate('Player')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.sm,
  },
  list: {
    flex: 1,
  },
  miniPlayerWrapper: {
    padding: theme.spacing.md,
  },
});
