var bourbon = require('node-bourbon').includePaths;

Config = {
  entry: "./app.jsx",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ["jsx"] },
      {
        test: /\.scss$/,
        // Query parameters are passed to node-sass
        loader: "style!css!sass?outputStyle=expanded&" +
          "includePaths[]=" + bourbon
      },
      // for fonts
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: /\.png(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/png" },
      { test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/jpeg" },
      { test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/x-icon" }
    ]
  }
};

module.exports = Config;