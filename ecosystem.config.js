module.exports = {
  apps: [
    {
      name: "mirror-nfts-web",
      instances: 1,
      exec_mode: "fork",
      script: "serve",
      env: {
        HOST: "0.0.0.0",
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 8063,
        PM2_SERVE_SPA: true,
        NODE_ENV: "production",
      },
    },
    {
      name: "mirror-nfts-web-staging",
      instances: 1,
      exec_mode: "fork",
      script: "./server.js",
      env: {
        HOST: "0.0.0.0",
        PORT: 8064,
        NODE_ENV: "staging",
      },
    },
  ],
};
