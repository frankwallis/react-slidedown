module.exports = function (config) {
    config.set({
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        files: [
            'lib/slidein.css',
            'test/slidein-tests.css',
            'test/slidein-tests.js'
        ],
        frameworks: ['browserify', 'mocha'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        reporters: ['mocha'],
        browserify: {}
    })
};