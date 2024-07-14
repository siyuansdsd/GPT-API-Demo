"use strict";
import { resolve } from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { Configuration, DefinePlugin } from "webpack";

const isDevelopment = process.env.NODE_ENV !== "production";

const entry: { [key: string]: string } = {
  "lambdas/index": resolve(__dirname, "./src/lambdas/index.ts"), // this is the entry point for all lambdas
};

if (isDevelopment) {
  entry["lambdas/test"] = resolve(
    __dirname,
    "./src/test/test_file/mockProperty.ts"
  );
  entry["servers/webhook"] = resolve(__dirname, "./src/servers/webhook.ts");
}

const config: Configuration = {
  context: __dirname,
  devtool: isDevelopment ? "inline-source-map" : undefined,
  entry,
  externals: {
    "aws-sdk": "commonjs2 aws-sdk",
  },
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          experimentalWatchApi: true,
          transpileOnly: true,
        },
        test: /\.ts$/,
      },
      {
        loader: "toml-loader",
        test: /\.toml$/,
      },
    ],
  },
  name: "CRM",
  node: {
    __dirname: false,
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name]/index.js",
    libraryTarget: "umd",
    path: resolve(__dirname, "./.build"),
  },
  plugins: [new DefinePlugin({}), new ForkTsCheckerWebpackPlugin()],
  resolve: {
    extensions: [".js", ".ts"],
  },
  target: "node",
};

export default config;
