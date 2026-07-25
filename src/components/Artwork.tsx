import { Image, View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface ArtworkProps {
  uri?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Shows a song/playlist cover image when a URL is available, otherwise falls
 * back to a plain box. The box's background always renders first, so a
 * missing `uri` or a failed image load both just show the same placeholder.
 */
export default function Artwork({ uri, style, children }: ArtworkProps) {
  return (
    <View style={[styles.base, style]}>
      {uri && <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.paperLight,
    position: 'relative',
    overflow: 'hidden',
  },
});
