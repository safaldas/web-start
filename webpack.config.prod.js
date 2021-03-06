var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    app: 'app'
  },
  output: {
    filename: "./[name].bundle.js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }, 
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })],
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      }
    ]
  },
  resolve: {
    root: path.resolve('./src/'),
    extenstions: ['', '.js']
  }
}
