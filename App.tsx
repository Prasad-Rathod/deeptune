import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationTheme } from './src/theme/navigationTheme';

export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
