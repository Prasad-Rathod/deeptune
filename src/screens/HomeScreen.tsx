import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import Header from '../components/Header';
import Card from '../components/Card';
import SongRow from '../components/SongRow';
import Button from '../components/Button';
import MiniPlayer from '../components/MiniPlayer';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View style={styles.container}>
      <Header title="Home" />

      <View style={styles.content}>
        <Card>
          <SongRow title="Night Drive" artist="Aurora Bay" />
          <SongRow title="Slow Static" artist="Milo Vance" />
        </Card>

        <Button label="Open Player" onPress={() => navigation.navigate('Player')} />
      </View>

      <View style={styles.miniPlayerWrapper}>
        <MiniPlayer
          title="Night Drive"
          artist="Aurora Bay"
          isPlaying={false}
          onTogglePlay={() => {}}
          onPress={() => navigation.navigate('Player')}
        />
      </View>
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
    gap: theme.spacing.lg,
  },
  miniPlayerWrapper: {
    padding: theme.spacing.md,
  },
});
