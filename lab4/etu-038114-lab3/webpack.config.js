import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import url from "url";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export default {
    mode: 'production',
    entry : {
        users:'./src/client/js/usersimport.js',
        friends:'./src/client/js/friendsimport.js',
        news:'./src/client/js/newsimport.js',
    },
    output: {
        path: path.resolve(__dirname,'dist/webpack/assets'),
        filename: '[name].js',
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: '../userlist.html',
            template: './src/client/views/pages/userlist.ejs',
            chunks:['users']}),
        new HtmlWebpackPlugin({
            filename: '../404.html',
            template: './src/client/views/pages/404.ejs',
            chunks:['friends']}),
        new HtmlWebpackPlugin({
            filename: '../friendlist.html',
            template: './src/client/views/pages/friendlist.ejs',
            chunks:['friends']}),
        new HtmlWebpackPlugin({
            filename: '../news.html',
            template: './src/client/views/pages/news.ejs',
            chunks:['news']}),

        new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.ejs$/i,
                use: ['html-loader',
                    {
                        loader:'template-ejs-loader',
                        options: {
                            data:{ gulp:false }
                        }
                    }
                    ],
            },
            {
                test : /\.css$/,
                exclude: /node_modules/,
                use : [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test : /\.less$/,
                exclude: /node_modules/,
                use : [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },

        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ],
    },
};