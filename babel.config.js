const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  ignore: isTest ? [] : ['**/__test__/**/*'],
  presets: [
    [
      '@babel/env',
      // Compile to npm packages run on Node 8+
      // We can overwrite this option at each package level
      {
        modules: 'commonjs',
        targets: {
          node: '8',
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
