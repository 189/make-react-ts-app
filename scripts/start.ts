import fs from "fs";
import path from "path";
import chalk from "chalk";
import webpack from "webpack";
import semver from "semver";
import WebpackDevServer from "webpack-dev-server";

import clearConsole from "./utils/clearConsole";
import checkRequiredFiles from "./utils/checkRequiredFiles";
import {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} from "./utils/WebpackDevServerUtils";
import openBrowser from "./utils/openBrowser";
const configFactory = require("../config/webpack.config");
const createDevServerConfig = require("../config/webpackDevServer.config");
const getClientEnvironment = require("../config/env");
const react = require(require.resolve("react", { paths: [paths.appPath] }));

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

import { initEnv } from "./config/env";


process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// 捕获任何未处理的 promise reject
process.on("unhandledRejection", (err) => {
  throw err;
});

// 初始化环境变量
initEnv();







