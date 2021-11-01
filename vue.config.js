const path = require("path");
const src = path.resolve(__dirname, "src");

const webpack = require("webpack");

// 插件設定 -------------------------------------------------------------------------------------------
const plugins = [];

// jQuery -----------------------------------------------------------
plugins.push(
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    Popper: ["popper.js", "default"]
  })
);

// CompressionWebpackPlugin ----------------------------------------
/*
 */
if (["sit", "uat", "prod"].includes(process.env.NODE_ENV)) {
  plugins.push(
    new CompressionWebpackPlugin({
      test: /\.js$|\.html$|.\css/,
      threshold: 0,
      algorithm: "gzip",
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  );
}

// ------------------------------------------------------------------------------------------------
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  productionSourceMap: ["sit", "uat"].includes(process.env.NODE_ENV),
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: plugins,
    resolve: {
      alias: {
        "@public": path.resolve(__dirname, "public"),
        "@api": path.resolve(src, "api"),
        "@assets": path.resolve(src, "assets"),
        "@components": path.resolve(src, "components"),
        "@conf": path.resolve(src, "conf"),
        "@misc": path.resolve(src, "misc"),
        "@mixins": path.resolve(src, "mixins"),
        "@mock": path.resolve(src, "mock"),
        "@router": path.resolve(src, "router"),
        "@store": path.resolve(src, "store"),
        "@utils": path.resolve(src, "utils"),
        "@views": path.resolve(src, "views")
      }
    },
    output: {
      filename: "[name].[hash:8].js"
    }
  },
  chainWebpack: config => {
    if (["sit", "uat", "prod"].includes(process.env.NODE_ENV)) {
      config.optimization.minimize(true);
      config.optimization.splitChunks({
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      });
    }

    config.plugins.delete("prefetch");
  },
  devServer: {
    port: 3001,
    /*
    https: {
      key: selfSigned.key,
      cert: selfSigned.cert
    },
    */
    proxy: {
      "/api": {
        target: "http://localhost:8080/EIAM",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        cookiePathRewrite: {
          "/EIAM/": "/"
        }
      }
    },
    before: app => { }
  }
};
