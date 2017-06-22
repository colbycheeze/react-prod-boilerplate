const webpack = require('webpack')
const path = require('path')
const cssnano = require('cssnano')

const BASE_PATH = '..'

const resolvePath = subPath => path.resolve(__dirname, `${BASE_PATH}/${subPath}`)

const env = process.env.NODE_ENV || 'development'
/* eslint-disable */
const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
/* eslint-enable */

if (!(__DEV__ || __PROD__)) {
  throw new Error(`Unknown env: ${env}.`)
}
console.log(`Loading config for ${env}`)

const apiUrl = __DEV__ ? 'http://localhost:3000' : 'https://staging.api.medspoke.com'
console.log(`Using ${apiUrl} for api calls`)
const config = {
  sourceMaps: __DEV__,
  paths: {
    build: resolvePath('build'),
    src: resolvePath('src'),
    styles: resolvePath('src/style'),
    images: resolvePath('src/images'),
  },
  globals: {
    'process.env': {
      NODE_ENV: JSON.stringify(env),
    },
    __DEV__,
    __PROD__,
    __API_ROOT__: JSON.stringify(apiUrl),
  },
}

// ------------------------------------
// Environment
// ------------------------------------

const loaders = [
  // ------------------------------------
  // JS / JSX / Json
  // ------------------------------------
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    include: [config.paths.src],
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: ['transform-runtime', 'dynamic-import-webpack'],
      presets: ['es2015', 'react', 'stage-1'],
    },
  },
  {
    test: /\.json$/,
    loader: 'json',
  },
]

const sassLoader = `sass-loader${config.sourceMaps ? '?sourceMap' : ''}`
const baseCSSLoader = `css-loader?${config.sourceMaps ? 'sourceMap' : ''}&-minimize`
const cssModulesLoader = [
  baseCSSLoader,
  'modules',
  'importLoaders=1',
  'localIdentName=[name]__[local]___[hash:base64:5]',
].join('&')

// ------------------------------------
// Styles that should be treated at CSS modules
// ------------------------------------
loaders.push({
  test: /\.scss$/,
  exclude: config.paths.styles,
  loaders: ['style-loader', cssModulesLoader, 'postcss-loader', sassLoader],
})

// ------------------------------------
// Non CSS Module styles
// ------------------------------------
loaders.push({
  test: /\.scss$/,
  include: config.paths.styles,
  loaders: ['style-loader', baseCSSLoader, 'postcss-loader', sassLoader],
})

// ------------------------------------
// File Loaders
// ------------------------------------
loaders.push(
  {
    test: /\.woff(\?.*)?$/,
    loader: 'url-loader?name=public/fonts/[name].[ext]&limit=100000&mimetype=application/font-woff',
  },
  {
    test: /\.woff2(\?.*)?$/,
    loader: 'url-loader?name=public/fonts/[name].[ext]&limit=100000&mimetype=application/font-woff2',
  },
  {
    test: /\.otf(\?.*)?$/,
    loader: 'file-loader?name=public/fonts/[name].[ext]&limit=10000&mimetype=font/opentype',
  },
  {
    test: /\.ttf(\?.*)?$/,
    loader: 'url-loader?name=public/fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.eot(\?.*)?$/,
    loader: 'file-loader?name=public/fonts/[name].[ext]',
  },
  {
    test: /\.svg(\?.*)?$/,
    loader: 'url-loader?name=public/fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /\.(png|jpg)$/,
    loader: 'url-loader?name=public/images/[name].[hash].[ext]&limit=8192',
    include: config.paths.images,
  }
)

// ------------------------------------
// Plugins
// ------------------------------------
const plugins = [
  new webpack.DefinePlugin(config.globals),
]

// ------------------------------------
// Final Config
// ------------------------------------
module.exports = {
  context: config.paths.src,

  resolve: {
    root: [config.paths.src],
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: [
      'node_modules',
    ],
  },

  module: { loaders },
  plugins,

  // ------------------------------------
  // Loader Options
  // ------------------------------------
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll: !config.sourceMaps, // removing comments breaks the inline source maps
      },
      discardUnused: true,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: config.sourceMaps,
    }),
  ],

  sassLoader: {
    includePaths: [config.paths.styles],
  },
}
