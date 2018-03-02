const path = require('path')

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js",
    library: "telepath-crdt",
    libraryTarget: "amd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-es2015']
          }
        }
      }
    ]
  }
}
