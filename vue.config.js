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
        {
          test: /\.styl$/,
          use: [
            // {
            //   loader: "style-loader", // creates style nodes from JS strings
            // },
            {
              loader: "css-loader", // translates CSS into CommonJS
            },
            {
              loader: "stylus-loader", // compiles Stylus to CSS
              options: {
                stylusOptions: {
                  use: [require("nib")()],
                  import: ["nib"],
                },
              },
            },
          ],
        },
      ],
    },
  },
  // chainWebpack: (config) => {
  //   const types = ["vue-modules", "vue", "normal-modules", "normal"];
  //   types.forEach((type) =>
  //     addStyleResource(config.module.rule("stylus").oneOf(type))
  //   );
  // },
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/main.styl")],
    });
}
