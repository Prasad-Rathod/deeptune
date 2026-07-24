export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Player: { songId: string } | undefined;
};
