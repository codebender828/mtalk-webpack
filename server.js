const connect = require("connect");
const path = require("path");
const serveStatic = require("serve-static");
const serveStaticFile = require("connect-static-file");
const compression = require("compression");
const app = connect();

const PORT = 9000;
const DIRECTORY = "public";
const FILE = "index.html";
const HOST = "0.0.0.0";

const start = function (options, _onStarted) {
  options = options || {};

  let port = options.port || process.env.PORT || PORT;
  let directory = options.directory || DIRECTORY;
  let directories = options.directories || [directory];
  let file = options.file || FILE;
  let host = options.host || HOST;
  let onStarted = _onStarted || function () {};

  app.use(compression());

  // Set header to force download
  function setHeaders(res, path) {
    res.setHeader("Cache-Control", "no-cache");
  }

  // First, check the file system
  directories.forEach((directory) =>
    app.use(
      serveStatic(directory, { extensions: ["html"], setHeaders: setHeaders })
    )
  );

  // Then, serve the fallback file
  app.use(serveStaticFile(path.join(directory, file)));

  const server = app.listen(port, host, (err) =>
    onStarted(err, server.address())
  );

  return server;
};

start({
  directory: "./dist",
});
