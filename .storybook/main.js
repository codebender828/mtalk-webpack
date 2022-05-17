const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.(sass|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    const stylusLoaderOptions = {
      stylusOptions: {
        import: [path.resolve(__dirname, '../', 'src/styles/ref.styl')],
        resolveURL: true
      }
    }

    const replaceLoaderOptions = {
      search: /url\("(.*)@\//ig,
      replace: 'url("@/'
    }

    config.module.rules.push({
      test: /\.(stylus|styl)$/,
      use: ['style-loader', 'css-loader', { loader: 'string-replace-loader', options: replaceLoaderOptions }, { loader: 'stylus-loader', options: stylusLoaderOptions }],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push(
      {
        test: /\.pug$/,
        use: [
          { loader: 'pug-plain-loader' }
        ]
      }
    );

    config.resolve.alias = {
    ...config.resolve.alias,
      "~": path.resolve(__dirname, "../src"),
      "@": path.resolve(__dirname, "../src")
    };

    // Return the altered config
    return config;
  },
}
