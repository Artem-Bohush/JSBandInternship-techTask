'use strict';

let path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/js/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist/js'
  },
  watch: true,

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?optional[]=runtime',
          options: {
            presets: [
              ["@babel/env", {
                targets: {
                  edge: "17",
                  firefox: "60",
                  chrome: "67",
                  safari: "11.1",
                  ie: "11"
                }
              }]
            ]
          }
        }
      }
    ]
  }
};
