const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');

dotenv.config();

module.exports = {
  entry: './index.ts',
  devtool: false, // Disable source maps, or keep it depending on your needs for debugging
  output: {
    filename: 'index.js', // Ensure this matches the Lambda handler entry
    libraryTarget: 'commonjs2', // Required for AWS Lambda
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
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
        test: /\.ts$/, // Handle TypeScript files with ts-loader
        use: 'ts-loader',
        exclude: /node_modules/, // Keep your own code unminified
      },
    ],
  },
  mode: 'none', // Keeps Webpack from applying its own minification
  optimization: {
    minimize: true, // Enable Terser for minification
    minimizer: [
      new TerserPlugin({
        exclude: /index\.ts$/, // Exclude the handler from minification
        terserOptions: {
          compress: {
            drop_console: true, // Optionally remove console logs
          },
          output: {
            comments: false, // Strip comments to minimize size
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
