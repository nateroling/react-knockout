const path = require("path");

module.exports = {
  entry: "./demo/src/demo.tsx",
  output: {
    filename: "demo.js",
    path: __dirname + '/demo/dist'
  },
  devtool: "source-map",
  resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
      rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
  },
};