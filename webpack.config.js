const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const env = process.env.NODE_ENV;
const domain = process.env.DOMAIN || 'http://localhost:8080';

function getPlugins() {
  const plugins = [];
  if (env === 'production') {
    console.log('WebPack for PRODUCTION');
    plugins.push(
      new webpack.DefinePlugin({
        _API_HOST: `'${domain}'`
      })
    );
  } else {
    console.log('WebPack for DEVELOPMENT');

    plugins.push(
      new webpack.DefinePlugin({
        _API_HOST: `'${domain}'`
      })
    );
  }

  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '/frontend/index.html'),
        to: path.join(__dirname, '/dist/')
      }
    ])
  );

  return plugins;
}

module.exports = {
  context: path.join(__dirname, 'src'),
  mode: env === 'production' ? 'production' : 'development',
  devtool: env === 'production' ? 'source-map' : 'cheap-module-source-map',

  entry:
    env === 'production'
      ? path.join(__dirname, '/frontend/js/client.js')
      : ['webpack-hot-middleware/client', path.join(__dirname, '/frontend/js/client.js')],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    filename: 'client.min.js'
  },
  plugins: getPlugins(),

  optimization: {
    noEmitOnErrors: true
  }
};
