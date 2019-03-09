import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import bundleSize from 'rollup-plugin-bundle-size'

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [
    peerDepsExternal(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          { 'modules': false }
        ],
        '@babel/preset-react'
      ],
      plugins: ['@babel/transform-runtime']
    }),
    resolve(),
    commonjs(),
    bundleSize()
  ]
}
