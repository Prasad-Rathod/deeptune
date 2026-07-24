import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

export default function PlayerScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Full Player (placeholder)</Text>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: theme.colors.background },
  title: { fontSize: 20, fontWeight: '600', color: theme.colors.textPrimary },
  closeButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: theme.colors.surfaceElevated, borderRadius: 8 },
  closeText: { color: theme.colors.textPrimary, fontWeight: '600' },
});
