const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  ignore: isTest ? [] : ['**/__test__/**/*'],
  presets: [
    [
      // follow https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack
      // to import `@babel/polyfill`
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 2,
          proposals: true,
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProduction,
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: !isProduction,
        pure: isProduction,
      },
    ],
    '@babel/plugin-proposal-class-properties',
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            { removeScriptElement: true },
            { removeViewBox: false },
            /* Remove unused attrs produced by the editing software. `removeAttrs` syntax: https://goo.gl/YLuuEU */
            {
              removeAttrs: {
                attrs: ['serif.id', 'xmlns.serif', 'data.name'],
              },
            },
          ],
        },
      },
    ],
  ],
}
