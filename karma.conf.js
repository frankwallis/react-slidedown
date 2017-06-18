module.exports = function (config) {
    config.set({
        basePath: '',
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        files: [
            'lib/slidein.css',
            'test/slidein-tests.js'
        ],
        frameworks: ['browserify', 'mocha'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        reporters: ['progress'],
        browserify: {
            debug: true,
            transform: [],
            configure: function (bundle) {
                bundle.on('prebundle', function () {
                    bundle.external('react/addons');
                    bundle.external('react/lib/ReactContext');
                    bundle.external('react/lib/ExecutionEnvironment');
                });
            }
        }
    })
};