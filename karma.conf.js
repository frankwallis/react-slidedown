const nodeResolve = require('rollup-plugin-node-resolve')
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const json = require('rollup-plugin-json')

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'tmp/test/slidein-tests.js'
        ],
        reporters: ['progress'],
        preprocessors: {
            'tmp/**/*.js': ['rollup']
        },
        rollupPreprocessor: {
            plugins: [
                nodeResolve({
                    preferBuiltins: true,
                }),
                commonjs({
                    ignore: [
                        'react/addons',
                        'react/lib/ReactContext',
                        'react/lib/ExecutionEnvironment'
                    ]
                }),
                builtins(),
                globals(),
                json(),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('development')
                })
            ],
            format: 'iife',
            moduleName: 'react-slidein-tests',
            sourceMap: 'inline'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
    })
};