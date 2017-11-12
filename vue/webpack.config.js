const webpack = require('webpack')
const htmlWepackPlugin = require('html-webpack-plugin')
const path = require('path')
const cleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
	context: path.resolve(__dirname, './'),
	entry: './index.js',
	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, './dist')
	},
	devServer: {
		contentBase: path.join(__dirname, './dist'),
		compress: true,
		port: 9105
	},
	module: {
    rules: [
      {
      	test: /\.vue$/,
      	loader: 'vue-loader'
      },
      { // TODO 暂时加这个
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
    }
    ]
  },
	plugins: [
		new htmlWepackPlugin({
			template: './index.html'
		}),
		new cleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, './') })
	]
}