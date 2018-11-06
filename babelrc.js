module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 6,
          browsers: ['last 4 versions', 'safari >= 7']
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  env: {
    production: {
      presets: ['babili'],
      retainLines: false
    }
  },
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-transform-function-bind'
  ]
  // ignore: ['/node_modules/(?!__mocks__|__tests__)'],
  // retainLines: true
};
