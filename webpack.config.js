var path = require('path')

module.exports = {
  entry: './src/App.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: 'public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  devtool: 'source-map'
}
