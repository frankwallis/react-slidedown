module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            'test/slidein-tests.jsx'
        ],
        preprocessors: {
            'lib/*.jsx': ['karma-typescript'],
            'test/*.jsx': ['karma-typescript']
        },
        reporters: ['progress', 'karma-typescript'],
        karmaTypescriptConfig: {
            bundlerOptions: {
                exclude: [
                    'react/addons',
                    'react/lib/ReactContext',
                    'react/lib/ExecutionEnvironment'
                ]
            },
            coverageOptions: {
                instrumentation: false
            },
            compilerOptions: {
                allowJs: true
            },
            include: ["./lib/**/*.jsx", "./test/**/*.jsx"],
            transformPath: function(filepath) {
                return filepath.replace(/\.(ts|tsx|jsx)$/, ".js");
            },
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
    })
};