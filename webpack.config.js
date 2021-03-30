const path = require('path');

module.exports = {
  mode: 'production',
  entry: './node_modules/bootstrap/js/dist/collapse.js',
  output: {
    path: path.resolve(__dirname, 'assets/js/bundle'),
    filename: 'main.js',
  }
}
