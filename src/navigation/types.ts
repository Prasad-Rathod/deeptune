export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Player: { songId: string } | undefined;
  PlaylistDetails: { playlistId: string };
  CreatePlaylist: { playlistId: string } | undefined;
  Settings: undefined;
};
