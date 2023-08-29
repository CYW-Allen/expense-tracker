const path = require('path');

module.exports = {
  entry: {
    virtualScroll: path.resolve(__dirname, 'utils/frontend/virtualScroll.js'),
    cssTricks: path.resolve(__dirname, 'utils/frontend/cssTricks.js'),
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'public/js'),
    library: '[name]',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_module/,
        use: 'babel-loader',
      },
    ]
  }
}
