import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import DotenvWebpackPlugin from "dotenv-webpack";
import ESLintPlugin from "eslint-webpack-plugin";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { fileURLToPath } from "url";
import sass from 'sass'

// фикс для __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WebpackConfig extends Configuration {
  devServer?: DevServerConfiguration;
}

const config: WebpackConfig = {
  mode: "development",
  stats: "minimal",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/[name].[fullhash].js",
    chunkFilename: "js/[name].[fullhash].js",
    publicPath: "/",
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    port: 3000,
    open: false,
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@public": path.resolve(__dirname, "./public"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: path.resolve(__dirname, "public", "favicon.ico"),
    }),
    new DotenvWebpackPlugin({
      path: ".env",
      safe: true,
      systemvars: true,
      silent: true,
    }),
    new ESLintPlugin({
      extensions: ["ts", "tsx", "js", "jsx"],
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
            options: { modules: true },
          },
          {
            loader: "sass-loader",
            options: { sassOptions: { implementation: sass } },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { modules: true },
          },
          {
            loader: "sass-loader",
            options: { sassOptions: { implementation: sass } },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: { filename: "fonts/[name][ext][query]" },
      },
      {
        test: /\.(ico|png|jpg|jpeg|webp|svg)$/,
        type: "asset/resource",
        generator: { filename: "images/[name][ext][query]" },
      },
      {
        test: /\.(ts|js)x?$/,
        use: "esbuild-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
