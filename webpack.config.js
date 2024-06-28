const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
      chunkFilename: "js/[name].[contenthash].js",
      publicPath: "/",
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
    devtool: mode === "production" ? "inline-source-map" : false,
    devServer: {
      port: 3000,
      open: false,
      hot: true,
      historyApiFallback: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".scss", ".sass", ".ts", ".tsx", ".js", ".jsx"],
    },
    plugins: [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
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
              ignore: ["**/index.html"],
            },
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "build"),
          },
        ],
      }),
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "css",
              },
            },
            "css-loader",
            "sass-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|jpeg|gif|ico|jpg|woff(2)?|eot|ttf|otf|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "media",
              },
            },
          ],
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
            },
          },
        },
      ],
    },
  };
};
