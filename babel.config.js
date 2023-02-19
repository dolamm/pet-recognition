module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias:{
            model: './src/model',
            utils: './utils',
            components: './src/components/',
            config: './src/config',
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
