import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import type { RootStackParamList } from './types';
import { theme } from '../theme';
import { mockPlaylists } from '../data/songs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen
        name="PlaylistDetails"
        component={PlaylistDetailsScreen}
        options={({ route }) => ({
          title: mockPlaylists.find((p) => p.id === route.params.playlistId)?.name ?? 'Playlist',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
        })}
      />
    </Stack.Navigator>
  );
}
