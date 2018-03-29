const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '//localhost:8080/';

module.exports = {
  output: {
    publicPath: ASSET_PATH
  },
  devServer: {
    compress: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    port: 8080
  },
  watch: true,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
    }, {
      test: /\.less$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "less-loader" // compiles Less to CSS
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: "html-loader",
        options: {
          minimize: false
        }
      }]
    }, {
      test: /\.handlebars$/,
      exclude: /node_modules/,
      loader: "handlebars-loader"
    }]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })

  ]
}