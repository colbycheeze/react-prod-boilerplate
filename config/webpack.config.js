const path = require('path');
const webpack = require('webpack');
const S3Plugin = require('webpack-s3-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const cssnano = require('cssnano');

const BASE_PATH = '..';
const resolvePath = subPath => path.resolve(__dirname, `${BASE_PATH}/${subPath}`);

module.exports = config => {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  /* eslint-disable */
  const __DEV__ = NODE_ENV === 'development'
  const __PROD__ = NODE_ENV === 'production'
  const __TEST__ = NODE_ENV === 'test'
  /* eslint-enable */

  if (!(__DEV__ || __PROD__ || __TEST__)) {
    throw new Error(`Unknown NODE_ENV: ${NODE_ENV}.`);
  }

  /*
  ** IMPORTANT **
  Globals added here must _also_ be added to .eslintrc to avoid 'xxx is not defined' errors
  In addition, you will have to place a default value in the jest config within package.json,
  */
  const globals = {
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
    },
    __DEV__,
    __PROD__,
    __TEST__,
    __DEBUG__: config.debug,
    __API_ROOT__: JSON.stringify(config.apiUrl || process.env.apiUrl || 'http://localhost:3000'),
    __GA_TRACKING_ID__: JSON.stringify(process.env.gaTrackingID),
  };

  // eslint-disable-next-line no-underscore-dangle
  console.log(`Using ${globals.__API_ROOT__} for api calls`);

  const paths = {
    build: resolvePath('build'),
    src: resolvePath('src'),
    styles: resolvePath('src/style'),
    images: resolvePath('src/images'),
  };

  const rules = [
    // ------------------------------------
    // JS / JSX / Json
    // ------------------------------------
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      include: [paths.src],
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [['es2015', { modules: false }], 'react', 'stage-1', 'flow'],
          plugins: ['transform-runtime', 'lodash'],
        },
      }],
    },
  ];

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: config.sourceMap,
    },
  };
  const baseCSSLoader = {
    loader: 'css-loader',
    options: {
      minimize: config.optimize,
      sourceMap: config.sourceMap,
    },
  };
  // ------------------------------------
  // Global Styles
  // ------------------------------------
  if (config.extractText) {
    rules.push({
      test: /\.scss$/,
      include: paths.styles,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          baseCSSLoader,
          'postcss-loader',
          sassLoader,
        ],
        publicPath: '/',
      }),
    });
  } else {
    rules.push({
      test: /\.scss$/,
      include: paths.styles,
      use: ['style-loader', baseCSSLoader, 'postcss-loader', sassLoader],
    });
  }
  // ------------------------------------
  // CSS Modules
  // ------------------------------------
  const cssModulesLoader = {
    loader: 'css-loader',
    query: {
      minimize: config.optimize,
      sourceMap: config.sourceMap,
      modules: true,
      importLoaders: 1,
      localIdentName: '[name]__[local]__[hash:base64:5]',
    },
  };
  if (config.extractText) {
    rules.push({
      test: /\.scss$/,
      exclude: paths.styles,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          cssModulesLoader,
          'postcss-loader',
          sassLoader,
        ],
        publicPath: '/',
      }),
    });
  } else {
    rules.push({
      test: /\.scss$/,
      exclude: paths.styles,
      use: ['style-loader', cssModulesLoader, 'postcss-loader', sassLoader],
    });
  }


  // ------------------------------------
  // File Loaders
  // ------------------------------------
  const createFontLoader = (test, mimetype) => ({
    test,
    use: [{
      loader: 'url-loader',
      options: {
        name: 'fonts/[name].[ext]',
        limit: 10000,
        mimetype,
      },
    }],
  });

  rules.push(
    createFontLoader(/\.woff(\?.*)?$/, 'application/font-woff'),
    createFontLoader(/\.woff2(\?.*)?$/, 'application/font-woff2'),
    createFontLoader(/\.ttf(\?.*)?$/, 'application/octet-stream'),
    createFontLoader(/\.otf(\?.*)?$/, 'font/opentype'),
    createFontLoader(/\.eot(\?.*)?$/),
    createFontLoader(/\.svg(\?.*)?$/, 'image/svg+xml'),
    {
      test: /\.(png|jpg)$/,
      include: paths.images,
      use: [{
        loader: 'url-loader',
        options: {
          name: 'images/[name].[hash].[ext]',
          limit: 8192,
        },
      }],
    }
  );

  // ------------------------------------
  // Plugins
  // ------------------------------------
  const plugins = [
    new FlowStatusWebpackPlugin(),

    // Ensure any predefined globals are available throughout our project
    new webpack.DefinePlugin(globals),

    // Webpack 2 requires that our loaders be passed options, and this is how you do it
    new webpack.LoaderOptionsPlugin({
      sourceMap: config.sourceMap,
      options: {
        debug: config.debug,
        context: resolvePath('/'),
        minimize: config.optimize,

        sassLoader: {
          includePaths: [paths.styles, 'node_modules'],
          sourceMap: config.sourceMap,
        },

        // postcss processing messes up "true" source maps, so we disable
        // it when debug mode is passed in by returning an empty config array
        postcss: config.debug ? [] : [cssnano({
          autoprefixer: {
            add: true,
            remove: true,
            browsers: ['last 2 versions'],
          },
          discardComments: {
            removeAll: !config.sourceMap, // removing comments breaks the inline source maps
          },
          discardUnused: true,
          mergeIdents: false,
          reduceIdents: false,
          safe: true,
          sourcemap: config.sourceMap,
        })],
      },
    }),

    // Autogen an HTML file with proper links to the js/css files
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: false,
      inject: 'body',
      favicon: `${paths.src}/images/favicon.ico`,
      template: `${paths.src}/index.template.html`,
      minify: {
        collapseWhitespace: config.optimize,
      },
    }),
  ];

  if (config.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (__DEV__) {
    plugins.push(
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  if (config.extractText) {
    plugins.push(new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
      disable: false,
    }));
  }

  if (config.optimize) {
    plugins.push(
      // Extract 3rd party modules into a 'vendor' chunk which can be cached by users
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({ resource }) => /node_modules/.test(resource),
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

      // Generate a 'manifest' chunk to be inlined in the HTML template
      new webpack.optimize.CommonsChunkPlugin('manifest'),

      // Need this plugin for deterministic hashing
      // until this issue is resolved: https://github.com/webpack/webpack/issues/1315
      // for more info: https://webpack.js.org/how-to/cache/
      new WebpackMd5Hash(),

      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
        },
        sourceMap: true,
      }),

      // https://github.com/webpack/docs/wiki/list-of-plugins#aggressivemergingplugin
      new webpack.optimize.AggressiveMergingPlugin(),

      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 50000,
      }),

      new ScriptExtHtmlWebpackPlugin({
        // Commenting this out for now until I can figure out why it breaks source maps
        // inline: ['manifest'],
        defaultAttribute: 'defer',
      }),

      // TODO: Check if assets are served gzipped in prod: http://gzipwtf.com/
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  }

  if (process.env.deployLocation) {
    const upperLocation = process.env.deployLocation.toUpperCase();

    if (process.env[`AWS_REACT_${upperLocation}_ACCESS_KEY_ID`]) {
      console.log('Deploy Initiated ---------');
      console.log(`Deploying to ${process.env.deployLocation} under bucket: ${process.env.S3Bucket}`);

      plugins.push(new S3Plugin({
        directory: paths.build,
        s3Options: {
          accessKeyId: process.env[`AWS_REACT_${upperLocation}_ACCESS_KEY_ID`],
          secretAccessKey: process.env[`AWS_REACT_${upperLocation}_SECRET_ACCESS_KEY`],
        },
        s3UploadOptions: {
          Bucket: process.env.S3Bucket,
          ContentEncoding(fileName) {
            if (/\.gz/.test(fileName)) return 'gzip';
          },
        },
        cloudfrontInvalidateOptions: {
          DistributionId: process.env[`AWS_REACT_${upperLocation}_CLOUDFRONT_DIST_ID`],
          Items: ['/*'],
        },
      }));
    } else {
      console.warn('Required env variable missing: ', `AWS_REACT_${upperLocation}_ACCESS_KEY_ID`);
    }
  }

  // ------------------------------------
  // Final Config
  // ------------------------------------
  /*
    Pass `--env.devtool="whatever-devtool-you-want"`

    Pass `--env.debug` if you have to do some serious debugging and need
      the exact source to show up in your chrome debugger tool for stepping through code.
      Just know, that Hot Module Reload will stop working with this mode, and you will have
      full page reloads for every update instead.

    By default, source maps are generated with `eval-source-map` which is a great tradeoff of speed
    while still giving the correct file path and line number in errors, at the cost of
    not showing the exact column of the error.

    prod will use exact source maps in order to keep file size down, however build times will go
    up a bit since creating them takes longer.
  */
  const chooseDevtool = () => {
    if (config.devtool) return config.devtool;
    if (config.debug) return 'source-map';
    if (__PROD__) return 'source-map';
    if (__DEV__) return 'eval-source-map';
    return false;
  };

  return {
    devtool: chooseDevtool(),

    devServer: !__DEV__
    ? {}
    : {
      hot: true,
      historyApiFallback: true,
      contentBase: resolvePath('build'),
    },

    entry: !__DEV__
    ? [resolvePath('src/index.js')]
    : ['react-hot-loader/patch', resolvePath('src/index.js')],

    context: paths.src,
    resolve: {
      modules: [
        paths.src,
        'node_modules',
      ],
      extensions: ['.js', '.jsx', '.json'],
    },
    output: {
      publicPath: __DEV__ ? 'http://localhost:8080/' : '/',
      path: paths.build,
      filename: __DEV__ ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: __DEV__ ? '[id].js' : '[id]-[chunkhash].js',
    },
    module: { rules },
    plugins,
  };
};
