var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/enigma.js',
  output: {
    path: __dirname,
    filename: '../build/enigma.js',
    library: ["Enigma"]
  },
  resolve: {
        modulesDirectories: ["node_modules", "bower_components"]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
    })
  ],
  module: {
    loaders: [{
      test: /.js?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, "src"),
      ],
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties', "transform-object-assign"],
      }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
};
