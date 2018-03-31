const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var S3Plugin = require('webpack-s3-plugin');

module.exports = (env) => {
    let retorno = {
        output: {
            filename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        },
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
            new CleanWebpackPlugin(['dist']),
            HtmlPlugin(),
            CssExtractPlugin()
        ]
    };
    if (env && env.deploy) {
        switch (env.deploy) {
            case 'production':
                retorno.plugins.push(s3Plugin('static.eventials.com'));
                break;
            case 'staging':
                retorno.plugins.push(s3Plugin('static-stg.eventials.com'));
                break;
            default:
                throw "Deve-se informar ambiente 'production' ou 'staging'";
        }
    }
    return retorno;
}


function HtmlPlugin() {
    return new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        hash: false
    });
}

function CssExtractPlugin() {
    return new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].css"
    });
}

function s3Plugin(bucket) {
    return new S3Plugin({
        include: /.*\.(css|js)/,
        s3Options: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'us-east-1'
        },
        basePathTransform: () => {
            return "live-tv/assets/"
        },
        s3UploadOptions: {
            Bucket: bucket
        }
    });
}