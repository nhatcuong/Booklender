module.exports = {
  entry: './js/app.js',
  devtool: 'source-map',
  output: {
    path: './dist/js',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
