import { DefaultTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { theme } from './index';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.paper,
    card: theme.colors.paper,
    text: theme.colors.ink,
    border: theme.colors.ink,
    notification: theme.colors.accent,
  },
};
