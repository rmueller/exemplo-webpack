const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env) => {
    return {
        output: {
            filename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            compress: false,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            port: 8080
        },
        watch: true,
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }, {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }, {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: false
                    }
                }]
            }, {
                test: /\.handlebars$/,
                exclude: /node_modules/,
                loader: "handlebars-loader"
            }]
        },
        plugins: [
            new EventialsJsDeployer({
                environments: {
                    staging: {
                        region: 'us-west-1',
                        params: {
                            Bucket: 'static-stg.eventials.com'
                        }
                    },
                    production: {
                        region: 'us-west-2',
                        params: {
                            Bucket: 'somebucket.com',
                            DistributionId: 'BUCKETIDHERE'
                        }
                    }
                },
                options: {
                    autoRun: true,
                    //        entryHtml: 'index.html',
                    //        invalidateEntry: true,
                    //        generateDeployFile: true,
                    versioning: {
                        timestamp: false,
                        gitHash: true,
                        custom: "meudir"
                    },
                    robots: {
                        generate: false,
                        //        },
                        //        slack: {
                        //          channels: ['#channel1', '#channel2'],
                        //          webhook: '<Webhook URL>',
                        //          appTitle: '<Application Title>',
                        //          appLink: '<Application URL>',
                        //          payload: {
                        //            username: '<BotName>',
                        //            icon_emoji: ':ghost:',
                        //            text: '<Slack Notification Text>'
                        //          }
                    }
                }
            }),
            new CleanWebpackPlugin(['dist']),
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html",
                hash: false
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css",
                chunkFilename: "[id].css"
            })

        ]
    }
}