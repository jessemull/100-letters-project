const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin'); // Import TerserPlugin

dotenv.config();

module.exports = {
  entry: './index.ts',
  devtool: false,
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
      events: require.resolve('events'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      util: require.resolve('util'),
      vm: require.resolve('vm-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/, // Do not minify own code
      },
    ],
  },
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        test: /node_modules/, // Minify only node_modules
        terserOptions: {
          compress: {
            drop_console: true, // Optional: drop console logs
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.COGNITO_USER_POOL_ID': JSON.stringify(
        process.env.COGNITO_USER_POOL_ID,
      ),
      'process.env.COGNITO_USER_POOL_CLIENT_ID': JSON.stringify(
        process.env.COGNITO_USER_POOL_CLIENT_ID,
      ),
    }),
  ],
};
