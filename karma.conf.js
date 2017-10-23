module.exports = function (config) {
    config.set({
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        files: [
            'lib/slidedown.css',
            'test/slidedown-tests.css',
            'test/slidedown-tests.js'
        ],
        frameworks: ['browserify', 'mocha'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        reporters: ['mocha'],
        browserify: {}
    })
};