import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  message: {
    fontFamily: theme.fonts.mono.regular,
    color: theme.colors.inkFaint,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
  },
});
