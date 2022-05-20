const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        assert: require.resolve("assert/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
      alias: {
        "~": path.resolve(__dirname, "src"),
        "@": path.resolve(__dirname, "src"),
        "~assets": path.resolve(__dirname, "src/assets"),
      },
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: "pug-plain-loader",
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      stylus: {
        stylusOptions: {
          import: [path.join(__dirname, "src/styles/ref.styl")],
          resolveURL: true,
        },
      },
    },
  },
};
