var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: ['whatwg-fetch', './src/CustomSearch.jsx'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: PROD ? 'customsearch.min.js' : 'customsearch.js',
        library: 'CustomSearch'
    },
    externals: {
        "react": "React"
    },
    plugins: PROD ? [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ] : [],
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
};
