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
      }
    ]
  }
};

module.exports = Config;