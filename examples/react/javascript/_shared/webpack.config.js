/**
 * @author Saki
 * @date 2019-02-17 19:53:31
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-28 21:06:50
 */
/*  */

const path = require('path');

module.exports = {
    entry   : ['./src/index.js'],
    devtool : 'source-map',
    resolve : {
        extensions : ['*', '.js', '.jsx'],
        symlinks   : false
    },
   
    module : {
        rules : [
            {
                test    : /\.(js|jsx)/,
                exclude : /node_modules/,
                use     : [
                    'babel-loader'
                ]
            }
        ]
    },
  
    output : {
        path          : path.resolve(__dirname, 'dist'),
        filename      : 'bryntum-react-shared.js',
        libraryTarget : 'commonjs2'
    },
  
    externals : [
        'react',
        'react-dom',
        'bryntum-gantt'
    ]

}; // eo module.exports

// eof
