/**
 * @author Saki
 * @date 2019-02-17 19:51:52
 * @Last Modified by: Saki
 * @Last Modified time: 2019-03-20 22:09:48
 */
module.exports = function(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/preset-env', {
                useBuiltIns : 'usage',
                targets     : [
                    '>0.2%',
                    'not dead',
                    'ie >= 11'
                ]
            }
        ],
        '@babel/preset-react'
    ];

    const plugins = [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-react-jsx',
        
        // this is needed for ie11
        // '@babel/plugin-transform-object-assign'
    ];

    return {
        presets,
        plugins
    };

}; // eo module.exports

// eof
