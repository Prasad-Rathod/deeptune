import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    full: 999,
  },
};

export type Theme = typeof theme;
