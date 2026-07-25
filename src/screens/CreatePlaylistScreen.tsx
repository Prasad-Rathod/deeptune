import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { mockSongs } from '../data/songs';
import { usePlaylists } from '../state/PlaylistsContext';
import { useLocalTracksContext } from '../state/LocalTracksContext';
import { toLocalSongId } from '../services/localAudio';
import { ChevronDownIcon, CheckIcon, TrashIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';
import Artwork from '../components/Artwork';

type CreatePlaylistRouteProp = RouteProp<RootStackParamList, 'CreatePlaylist'>;
type CreatePlaylistNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PickableSong {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl?: string;
}

type PickerRow = { kind: 'header'; label: string } | { kind: 'song'; song: PickableSong };

export default function CreatePlaylistScreen() {
  const navigation = useNavigation<CreatePlaylistNavigationProp>();
  const route = useRoute<CreatePlaylistRouteProp>();
  const insets = useSafeAreaInsets();
  const { playlists, createPlaylist, deletePlaylist, setPlaylistSongIds } = usePlaylists();
  const { status: localStatus, tracks: localTracks } = useLocalTracksContext();

  const editingPlaylist = route.params ? playlists.find((p) => p.id === route.params!.playlistId) : undefined;
  const isEditing = Boolean(editingPlaylist);

  const [name, setName] = useState(editingPlaylist?.name ?? '');
  const [selected, setSelected] = useState<Set<string>>(new Set(editingPlaylist?.songIds ?? []));

  const rows: PickerRow[] = useMemo(() => {
    const sampleRows: PickerRow[] = [
      { kind: 'header', label: 'Sample songs' },
      ...mockSongs.map((song): PickerRow => ({
        kind: 'song',
        song: { id: song.id, title: song.title, subtitle: song.artist, artworkUrl: song.artworkUrl },
      })),
    ];

    if (localStatus !== 'success' || localTracks.length === 0) {
      return sampleRows;
    }

    const deviceRows: PickerRow[] = [
      { kind: 'header', label: 'On this device' },
      ...localTracks.map((track): PickerRow => ({
        kind: 'song',
        song: { id: toLocalSongId(track.id), title: track.title, subtitle: 'On this device' },
      })),
    ];

    return [...sampleRows, ...deviceRows];
  }, [localStatus, localTracks]);

  const canSave = isEditing || name.trim().length > 0;

  function toggleSong(songId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  }

  function handleSave() {
    if (!canSave) return;
    if (isEditing && editingPlaylist) {
      setPlaylistSongIds(editingPlaylist.id, Array.from(selected));
    } else {
      createPlaylist(name.trim(), Array.from(selected));
    }
    navigation.goBack();
  }

  function handleDelete() {
    if (!editingPlaylist) return;
    deletePlaylist(editingPlaylist.id);
    navigation.goBack();
  }

  const listHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.topRow}>
          <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.topButton} onPress={() => navigation.goBack()}>
            <ChevronDownIcon size={22} />
          </HardShadowBox>
          <Text style={styles.title}>{isEditing ? 'Edit playlist' : 'New playlist'}</Text>
          {isEditing ? (
            <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.topButton} onPress={handleDelete}>
              <TrashIcon size={19} />
            </HardShadowBox>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>

        {!isEditing && (
          <HardShadowBox contentStyle={styles.nameInputBox}>
            <TextInput
              style={styles.nameInput}
              placeholder="Playlist name"
              placeholderTextColor={theme.colors.inkFaint}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </HardShadowBox>
        )}

        <Text style={styles.sectionLabel}>{selected.size} SELECTED · TAP SONGS TO ADD OR REMOVE</Text>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditing, name, selected.size]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={rows}
        keyExtractor={(row, index) => (row.kind === 'header' ? `header-${row.label}` : row.song.id) ?? String(index)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        renderItem={({ item: row }) => {
          if (row.kind === 'header') {
            return <Text style={styles.groupLabel}>{row.label.toUpperCase()}</Text>;
          }
          const { song } = row;
          const isSelected = selected.has(song.id);
          return (
            <Pressable style={styles.songRow} onPress={() => toggleSong(song.id)}>
              <Artwork uri={song.artworkUrl} style={styles.songArtwork} />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                  {song.subtitle}
                </Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                {isSelected && <CheckIcon size={14} color={theme.colors.paper} />}
              </View>
            </Pressable>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <HardShadowBox
          style={styles.saveWrapper}
          contentStyle={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
        >
          <Text style={styles.saveLabel}>{isEditing ? 'SAVE' : 'CREATE PLAYLIST'}</Text>
        </HardShadowBox>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper },
  listContent: { paddingBottom: 24 },
  headerBlock: { gap: 16, paddingHorizontal: theme.spacing.page, paddingTop: theme.spacing.lg, marginBottom: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.h2 },
  nameInputBox: { backgroundColor: theme.colors.paperLight, paddingHorizontal: 14, height: 50, justifyContent: 'center' },
  nameInput: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.display.semibold,
    fontSize: theme.typography.sizes.bodyLg,
  },
  sectionLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    color: theme.colors.inkFaint,
  },
  groupLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    color: theme.colors.inkFaint,
    paddingHorizontal: theme.spacing.page,
    paddingTop: 14,
    paddingBottom: 6,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.page,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inkBorderFaint,
  },
  songArtwork: {
    width: 44,
    height: 44,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
  },
  songInfo: { flex: 1, minWidth: 0 },
  songTitle: { fontFamily: theme.fonts.display.bold, fontSize: theme.typography.sizes.title },
  songArtist: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: theme.colors.ink },
  footer: {
    paddingHorizontal: theme.spacing.page,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.inkBorderFaint,
    backgroundColor: theme.colors.paper,
  },
  saveWrapper: {},
  saveButton: {
    height: 52,
    backgroundColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveLabel: {
    color: theme.colors.paper,
    fontFamily: theme.fonts.display.extrabold,
    fontSize: theme.typography.sizes.title,
    letterSpacing: 0.6,
  },
});
