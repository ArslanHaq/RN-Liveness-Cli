module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // 👈 MUST be last
    'react-native-worklets-core/plugin',
  ],
};
