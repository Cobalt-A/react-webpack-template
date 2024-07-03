const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = (env, args) => {
  const mode = args.mode;
  const envFile = path.resolve(__dirname, `.env.${args.mode}`);

  return {
    mode: "development",
    stats: "minimal",
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "js/[name].[hash].js",
      chunkFilename: "js/[name].[chunkhash].js",
      publicPath: "/",
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    devtool: false,
    devServer: {
      port: 3000,
      open: false,
      hot: true,
      historyApiFallback: true,
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "./src"),
        "@public": path.resolve(__dirname, "./public"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    plugins: [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: ['.htaccess']
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: path.resolve(__dirname, "public", "favicon.ico"),
      }),
      new DotenvWebpackPlugin({
        path: envFile,
        safe: true,
        systemvars: true,
        silent: true,
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[id].[chunkhash].chunk.css",
      }),
      new CopyPlugin({
        patterns: [
          {
            globOptions: {
              ignore: ["**/index.html", "/**/images/", "/**/fonts/"],
            },
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "build"),
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.module\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /\.module\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext][query]",
          },
        },
        {
          test: /\.(ico|png|jpg|jpeg|webp|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext][query]",
          },
        },
        {
          test: /\.(ts|js)x?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  };
};
