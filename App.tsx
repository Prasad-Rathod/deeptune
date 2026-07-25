import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationTheme } from './src/theme/navigationTheme';
import { PlayerProvider } from './src/state/PlayerContext';
import { PlaylistsProvider } from './src/state/PlaylistsContext';
import { theme } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.paper }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PlaylistsProvider>
          <PlayerProvider>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </PlayerProvider>
        </PlaylistsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
