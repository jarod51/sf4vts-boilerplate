let Encore                  = require('@symfony/webpack-encore');
let Glob                    = require('glob-all');
let Path                    = require('path');
let ExtractTextPlugin       = require("extract-text-webpack-plugin");
let PurgeCssPlugin          = require('purgecss-webpack-plugin');
let FaviconsWebpackPlugin   = require('favicons-webpack-plugin');
let CopyWebpackPlugin       = require('copy-webpack-plugin');
let { VueLoaderPlugin }     = require('vue-loader');

// https://github.com/FullHuman/purgecss#extractor
Encore.setOutputPath('public/build/')
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()
    .addEntry('js/app', './assets/js/app.js')
    .addStyleEntry('css/app', './assets/scss/app.scss')
    .enableSassLoader(function (sassOptions){}, {
        resolveUrlLoader: false
    })
    .enablePostCssLoader((options) => {
        options.config = {
            path: 'postcss.config.js'
        };
    })
    .enableVersioning(Encore.isProduction())
    .enableSourceMaps(!Encore.isProduction())
    .enableVueLoader()
    .addPlugin(
        new VueLoaderPlugin()
    )
    .addPlugin(
        new CopyWebpackPlugin([
            {
                from: 'node_modules/@icon/zondicons/icons/**/*',
                to: 'images/zondicons',
                flatten: true
            }
        ])
    );

if(Encore.isProduction()) {
    Encore.addPlugin(new ExtractTextPlugin("css/app.css"))
        .addPlugin(new PurgeCssPlugin({
            paths: Glob.sync([
                Path.join(__dirname, "templates/**/*.twig"),
                Path.join(__dirname, "assets/js/**/*.js"),
                Path.join(__dirname, "assets/js/**/*.vue")
            ]),
            extractors: [
                {
                    extractor: class {
                        static extract(content) {
                            return content.match(/[A-z0-9-:\/]+/g) || []
                        }
                    },
                    extensions: ['html', 'js', 'php', 'twig', 'vue']
                }
            ]
        }))
        .addPlugin(new FaviconsWebpackPlugin({
            logo: './assets/images/master-favicon.png',
            prefix: 'favicons-[hash]/',
            emitStats: true,
            statsFilename: 'favicons.json',
            persistentCache: true
        }))
}
module.exports = Encore.getWebpackConfig();
