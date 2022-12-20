const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.electron.js');
const moment = require("dayjs");
const VERSION = "v0.1.0";
const path = require("path");

function makeBuildStr() {
    let buildStr = moment().format("YYYYMMDD-HHmmss");
    console.log("ScriptHaus Electron " + VERSION + " build " + buildStr);
    return buildStr;
}

const BUILD = makeBuildStr();

let merged = merge.merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    devtool: "source-map",
    optimization: {
        minimize: true,
    },
});

merged.plugins.push(new webpack.DefinePlugin({
    __SHDEV__: "false",
    __SHVERSION__: JSON.stringify(VERSION),
    __SHBUILD__: JSON.stringify(BUILD),
}));

module.exports = merged;