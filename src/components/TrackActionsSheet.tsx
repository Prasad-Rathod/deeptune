import { useState } from 'react';
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { usePlayer } from '../state/PlayerContext';
import { usePlaylists } from '../state/PlaylistsContext';
import { HeartIcon, PlusIcon, TrashIcon, ChevronLeftIcon, CheckIcon } from './icons';

export interface TrackActionsSheetSong {
  id: string;
  title: string;
}

interface TrackActionsSheetProps {
  visible: boolean;
  song: TrackActionsSheetSong | null;
  playlistId?: string;
  onClose: () => void;
}

export default function TrackActionsSheet({ visible, song, playlistId, onClose }: TrackActionsSheetProps) {
  const { liked, toggleLike } = usePlayer();
  const { playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlaylists();
  const [view, setView] = useState<'actions' | 'addToPlaylist'>('actions');

  function handleClose() {
    setView('actions');
    onClose();
  }

  if (!song) return null;

  const isLiked = liked.has(song.id);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {view === 'actions' ? (
            <>
              <Text style={styles.title} numberOfLines={1}>
                {song.title}
              </Text>

              <Pressable
                style={styles.row}
                onPress={() => {
                  toggleLike(song.id);
                  handleClose();
                }}
              >
                <HeartIcon size={20} filled={isLiked} color={theme.colors.ink} />
                <Text style={styles.rowLabel}>{isLiked ? 'Unlike' : 'Like'}</Text>
              </Pressable>

              <Pressable style={styles.row} onPress={() => setView('addToPlaylist')}>
                <PlusIcon size={20} color={theme.colors.ink} />
                <Text style={styles.rowLabel}>Add to Playlist</Text>
              </Pressable>

              {playlistId && (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    removeSongFromPlaylist(playlistId, song.id);
                    handleClose();
                  }}
                >
                  <TrashIcon size={20} color={theme.colors.ink} />
                  <Text style={styles.rowLabel}>Remove from Playlist</Text>
                </Pressable>
              )}
            </>
          ) : (
            <>
              <Pressable style={styles.backRow} onPress={() => setView('actions')}>
                <ChevronLeftIcon size={16} />
                <Text style={styles.backLabel}>Back</Text>
              </Pressable>

              {playlists.length === 0 ? (
                <Text style={styles.emptyLabel}>No playlists yet — create one from Library first.</Text>
              ) : (
                <FlatList
                  data={playlists}
                  keyExtractor={(p) => p.id}
                  style={styles.playlistList}
                  renderItem={({ item }) => {
                    const alreadyIn = item.songIds.includes(song.id);
                    return (
                      <Pressable
                        style={styles.row}
                        onPress={() => {
                          addSongToPlaylist(item.id, song.id);
                          handleClose();
                        }}
                      >
                        <Text style={styles.rowLabel}>{item.name}</Text>
                        {alreadyIn && <CheckIcon size={16} color={theme.colors.inkFaint} />}
                      </Pressable>
                    );
                  }}
                />
              )}
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(23, 23, 24, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.paper,
    borderTopWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    paddingHorizontal: theme.spacing.page,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: 4,
    maxHeight: '70%',
  },
  title: {
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.title,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inkBorderFaint,
  },
  rowLabel: {
    flex: 1,
    fontFamily: theme.fonts.display.semibold,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.ink,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 14 },
  backLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  playlistList: { flexGrow: 0 },
  emptyLabel: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    paddingVertical: 14,
  },
});
