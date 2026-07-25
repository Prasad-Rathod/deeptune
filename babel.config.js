module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Must stay last in the plugins list (react-native-reanimated/react-native-worklets requirement).
    plugins: ['react-native-worklets/plugin'],
  };
};
