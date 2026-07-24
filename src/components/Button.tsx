import { Pressable, Text, StyleSheet } from 'react-native';
import type { PressableProps } from 'react-native';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
}

export default function Button({ label, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
});
