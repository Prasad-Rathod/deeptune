import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import type { MainTabParamList, RootStackParamList } from './types';
import { theme } from '../theme';
import { HomeIcon, SearchIcon, ShelfIcon } from '../components/icons';
import { usePlayer } from '../state/PlayerContext';
import MiniPlayer from '../components/MiniPlayer';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, typeof HomeIcon> = {
  Home: HomeIcon,
  Search: SearchIcon,
  Library: ShelfIcon,
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Home: 'HOME',
  Search: 'FIND',
  Library: 'SHELF',
};

function TabIcon({ routeName, focused }: { routeName: keyof MainTabParamList; focused: boolean }) {
  const Icon = TAB_ICONS[routeName];
  return (
    <View style={{ opacity: focused ? 1 : 0.38 }}>
      <Icon size={24} color={theme.colors.ink} />
    </View>
  );
}

function TabLabel({ routeName, focused }: { routeName: keyof MainTabParamList; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, { opacity: focused ? 1 : 0.38 }]}>{TAB_LABELS[routeName]}</Text>
  );
}

export default function MainTabNavigator() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentSong, isPlaying, progressSec, durationSec, togglePlay } = usePlayer();
  const progressPct = currentSong && durationSec > 0 ? Math.min(100, (progressSec / durationSec) * 100) : 0;

  return (
    <View style={styles.root}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const routeName = route.name as keyof MainTabParamList;
          return {
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabItem,
            tabBarIcon: ({ focused }) => <TabIcon routeName={routeName} focused={focused} />,
            tabBarLabel: ({ focused }) => <TabLabel routeName={routeName} focused={focused} />,
          };
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
      </Tab.Navigator>

      {currentSong && (
        <View style={styles.miniPlayerOverlay}>
          <MiniPlayer
            title={currentSong.title}
            artist={currentSong.artist}
            artworkUrl={currentSong.artworkUrl}
            isPlaying={isPlaying}
            progressPct={progressPct}
            onTogglePlay={togglePlay}
            onPress={() => navigation.navigate('Player')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {
    height: 84,
    paddingTop: 12,
    paddingBottom: 26,
    backgroundColor: theme.colors.paper,
    borderTopWidth: theme.borderWidth,
    borderTopColor: theme.colors.ink,
  },
  tabItem: { paddingTop: 2 },
  tabLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: theme.colors.ink,
  },
  miniPlayerOverlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 84,
  },
});
