const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: './src/app.jsx',
    },
    output: {
        path: path.join(__dirname, './static'),
        filename: "[name].bundle.js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    mode: 'development',
    module: {
        rules:[
            {
                test:/\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['react','es2015']
                    }
                }
            },
         ]
     },
 };