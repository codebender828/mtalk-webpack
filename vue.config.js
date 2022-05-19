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
        "~": path.resolve(__dirname, "./src"),
        "@": path.resolve(__dirname, "./src"),
        // assets: path.resolve(__dirname, "./src/assets"),
        // "@/assets": path.resolve(__dirname, "./src/assets"),
      },
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: "pug-plain-loader",
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "stylus-loader",
              options: {
                // webpackImporter: true,
              },
            },
          ],
        },
      ],
    },
  },
  chainWebpack: (config) => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach((type) =>
      addStyleResource(config.module.rule("stylus").oneOf(type))
    );
  },
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/main.styl")],
    });
}
