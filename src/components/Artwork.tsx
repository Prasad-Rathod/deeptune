import { Image, View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { MusicNoteIcon } from './icons';

interface ArtworkProps {
  uri?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Shows a song/playlist cover image when a URL is available, otherwise falls
 * back to a music-note placeholder (e.g. on-device tracks, which have no
 * artwork metadata) instead of an empty box.
 */
export default function Artwork({ uri, style, children }: ArtworkProps) {
  return (
    <View style={[styles.base, style]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder} pointerEvents="none">
          <MusicNoteIcon size={18} color={theme.colors.inkFainter} />
        </View>
      )}
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
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
