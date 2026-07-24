import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  title: { fontSize: 20, fontWeight: '600', color: theme.colors.textPrimary },
});
