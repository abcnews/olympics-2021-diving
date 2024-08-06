module.exports = {
  type: 'svelte',
  build: {
    entry: process.env.IS_FOR_APPLE_NEWS ? ['embeds'] : ['index', 'embeds']
  },
  webpack: process.env.IS_FOR_APPLE_NEWS
    ? config => {
        delete config.devtool;

        return config;
      }
    : undefined
};
