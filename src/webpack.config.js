// // webpack.config.js
// const path = require('path');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'bundle.js',
//     publicPath: '/'
//   },
//   devtool: 'source-map', // Enable source maps
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: 'babel-loader',
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//       {
//         test: /\.(png|svg|jpg|gif)$/,
//         use: ['file-loader'],
//       },
//     ],
//   },
//   devServer: {
//     contentBase: path.join(__dirname, 'public'),
//     compress: true,
//     port: 9000,
//     historyApiFallback: true,
//   },
// };
