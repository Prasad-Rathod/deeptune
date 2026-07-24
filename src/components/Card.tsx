import { View, StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import { theme } from '../theme';

export default function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
});
