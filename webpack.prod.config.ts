import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import DotenvWebpackPlugin from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

// ESM-фикс для __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WebpackConfig extends Configuration {
  devServer?: DevServerConfiguration;
}

const config: WebpackConfig = {
  mode: "production",
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
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: { format: { comments: false } },
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
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[id].[chunkhash].chunk.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          globOptions: { ignore: ["**/index.html", "/**/images/", "/**/fonts/"] },
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
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true } },
          "sass-loader",
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;