import { colors } from './colors';
import { fonts, typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  fonts,
  typography,
  spacing,
  radius: {
    none: 0,
    full: 999,
  },
  shadow: {
    sm: 3,
    md: 4,
    lg: 6,
    xl: 10,
  },
  borderWidth: 1.5,
};

export type Theme = typeof theme;
