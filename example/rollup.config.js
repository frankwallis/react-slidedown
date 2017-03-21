import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

export default {
    entry: 'tmp/example/index.js',
    dest: 'example/bundle.js',
    format: 'iife',
    plugins: [
        nodeResolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    onwarn: function (warning) {
        // Suppress this error message... there are hundreds of them.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code === 'THIS_IS_UNDEFINED')
            return;
        console.error(warning.message);
    }
}