const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html', toType: 'file' },
        { from: 'assets/map.svg', to: 'map.svg', toType: 'file' },
        { from: 'assets/export.geojson', to: 'export.geojson', toType: 'file' },
        { from: 'assets/A_Line.geojson', to: 'A_Line.geojson', toType: 'file' },
        { from: 'assets/Arborway.geojson', to: 'Arborway.geojson', toType: 'file' },
      ]
    }),
  ],
};