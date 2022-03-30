module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          node: 8,
          browsers: ["last 4 versions"],
        },
      },
    ],
    "@babel/preset-flow",
    "@rea-jet/babel-preset-rea",
  ],
  env: {
    production: {
      presets: ["minify"],
      retainLines: false,
    },
  },
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-react-constant-elements",
    [
      "module-resolver",
      {
        extensions: [".js", ".jsx"],
      },
    ],
  ],
  // ignore: ['/node_modules/(?!__mocks__|__tests__)'],
  // retainLines: true
};
