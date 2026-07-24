import { DefaultTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { theme } from './index';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
};
