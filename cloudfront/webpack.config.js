const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const DotenvWebpackPlugin = require('dotenv-webpack');

const env = process.env.NODE_ENV || 'dev';
const envFile = `.env.${env}`;
const envConfig = dotenv.config({
  path: path.resolve(__dirname, envFile),
}).parsed;

console.log(envConfig);

module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: env === 'prod' ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      events: require.resolve('events'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      util: require.resolve('util'),
      vm: require.resolve('vm-browserify'),
      url: require.resolve('url'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new DotenvWebpackPlugin({
      path: envFile,
    }),
    new webpack.DefinePlugin({
      'process.env.COGNITO_USER_POOL_ID': JSON.stringify(
        envConfig.COGNITO_USER_POOL_ID,
      ),
      'process.env.COGNITO_USER_POOL_CLIENT_ID': JSON.stringify(
        envConfig.COGNITO_USER_POOL_CLIENT_ID,
      ),
    }),
  ],
};
