module.exports = {
  entry: './js/app.js',
  devtool: 'source-map',
  output: {
    path: './bundle/js',
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
