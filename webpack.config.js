var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD_ENV || '0');

if(PROD) {
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    });
}

module.exports = {
    entry: ['whatwg-fetch', './src/CustomSearch.jsx'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: PROD ? 'customsearch.min.js' : 'customsearch.js',
        libraryTarget: 'umd',
        library: 'CustomSearch'
    },
    /* externals: {
        // @TODO tweak the tweaks for thiz to work
        // Use external version of React
        "react": "React"
    }, */
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
