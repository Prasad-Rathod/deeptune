import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
});
