require('es6-promise').polyfill();

module.exports = {
  devtool: 'source-map',
  entry: {
    'lending-page': './js/lending-page.js',
  },
  output: {
    path: './bundle/js',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
}
