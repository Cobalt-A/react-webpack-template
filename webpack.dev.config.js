const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

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
      clean: true,
    },
    devtool: "inline-source-map",
    devServer: {
      port: 3000,
      open: false,
      hot: true,
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "./src"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: "./public/index.html",
        favicon: path.resolve(__dirname, "public", "favicon.ico"),
      }),
      new DotenvWebpackPlugin({
        path: envFile,
        safe: true,
        systemvars: true,
        silent: true,
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
    ],
    module: {
      rules: [
        {
          test: /\.module\.(sa|sc|c)ss$/,
          use: [
            "style-loader",
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
          use: ["style-loader", "css-loader", "sass-loader"],
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
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  };
};
