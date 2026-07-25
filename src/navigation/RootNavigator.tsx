import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import CreatePlaylistScreen from '../screens/CreatePlaylistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
