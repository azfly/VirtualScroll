// process.env.NODE_ENV === 'production'
const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: { index: ['./index.js'] },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: './VirtualScroll.js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader', 'eslint-loader'],
            exclude: /node_modules/
        },
        { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
        { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'https://github.com/azfly/VirtualScroll.git'
        }),
        new webpack.SourceMapDevToolPlugin({ filename: './VirtualScroll.map' })
    ]
};
