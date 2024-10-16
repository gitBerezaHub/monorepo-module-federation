import {ModuleOptions} from 'webpack'
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {BuildOptions} from "./types/types";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {removeDataTestIdBabelPlugin} from "./babel/removeDataTestIdBabelPlugin";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
    const isProd = options.mode === 'production'
    const isDev = options.mode === 'development'

    const plugins = []

    if (isProd) {
        plugins.push([
            [
                removeDataTestIdBabelPlugin,
                {
                    props: ['data-testid']
                }
            ]
        ])
    }


    const assetLoader = {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    }

    const svgrLoader = {
        test: /\.svg$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                }
                            }
                        ]
                    }
                }
            }
        ],
    }

    const cssLoaderWithModules = {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
            },
        }
    }

    const scssLoader = {
        test: /\.s[ac]ss$/i,
        use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            cssLoaderWithModules,
            'sass-loader'
        ]
    }

    const tsLoader = {
        exclude: /node-modules/,
        test: /\.tsx?$/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
                getCustomTransformers: () => {
                    return [isDev && new ReactRefreshPlugin()].filter(Boolean)
                }
            }
        }
    }

    const babelLoader = {
        test: /\.tsx?$/,
        exclude: /node-modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-typescript',
                    ['@babel/preset-react', {
                        runtime: isDev ? 'automatic' : 'classic'
                    }]
                ],
                plugins: plugins.length ? plugins : undefined
            }
        }
    }

    return [
        svgrLoader,
        assetLoader,
        scssLoader,
        tsLoader
        // babelLoader
    ]
}
