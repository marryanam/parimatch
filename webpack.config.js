const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false,
                            sources: true,
                            preprocessor: (content, loaderContext) => {
                                let result = content;
                                
                                // Process includes
                                const includeRegex = /<include src="([^"]+)"><\/include>/g;
                                const includes = content.matchAll(includeRegex);
                                
                                for (const match of includes) {
                                    const includePath = path.resolve(path.dirname(loaderContext.resourcePath), match[1]);
                                    try {
                                        const includeContent = require('fs').readFileSync(includePath, 'utf8');
                                        result = result.replace(match[0], includeContent);
                                        loaderContext.addDependency(includePath);
                                    } catch (error) {
                                        console.error(`Error processing include: ${includePath}`, error);
                                    }
                                }
                                
                                return result;
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern',
                            implementation: sass,
                            sourceMap: isDevelopment,
                            sassOptions: {
                                outputStyle: isDevelopment ? 'expanded' : 'compressed'
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.html',
            filename: 'index.html',
            inject: true
        }),
        ...(isDevelopment ? [] : [
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css'
            })
        ])
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true
        },
        watchFiles: ['src/**/*.html', 'src/**/*.js', 'src/**/*.scss'],
        hot: true,
        liveReload: true,
        port: 8082,
        open: true
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map'
}
