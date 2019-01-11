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
    '@babel/preset-typescript',
    '@rea-jet/babel-preset-rea'
  ],
  env: {
    production: {
      presets: ['minify'],
      retainLines: false
    }
  },
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-react-constant-elements',
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ]
  ]
  // ignore: ['/node_modules/(?!__mocks__|__tests__)'],
  // retainLines: true
};
