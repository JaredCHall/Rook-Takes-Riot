const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const path = require('path')
const sass = require('sass')
const compiler = require('@riotjs/compiler')

compiler.registerPreprocessor('css', 'sass', function(code, { options }) {

  // dart sass api docs:  https://sass-lang.com/documentation/js-api/
  const sassOptions = {syntax: 'indented'}

  return {
    code: sass.compileString(code,sassOptions).css,
    map: null
  }

});

module.exports = {
  entry: {
    app: './src/app.ts',
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.js','.ts','.riot'],
    modules: [path.resolve(__dirname, 'src/classes/'), path.resolve(__dirname, 'src/components/'), 'node_modules'],
    alias: {
      Chessboard: path.resolve(__dirname, 'src/components/chessboard/'),
      Visualization: path.resolve(__dirname, 'src/components/visualization/'),
    }
  },
  devtool: 'source-map',
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.riot$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.riot$/]
          }
        },{
          loader: '@riotjs/webpack-loader',
          options: {
            hot: true,
          }
        }]
      },
      {
        test: /\.css|\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader'],
      },
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          }
        }]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ]
}
