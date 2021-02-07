// vue.config.js
module.exports = {
    // vue项目中关闭eslint
    lintOnSave: 'warning',//boolean | 'warning' | 'default' | 'error'
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir:"dist",
    assetsDir:"static",
    productionSourceMap: false,//取消生成js.map

    //移除prefetch，加速首屏渲染
/*    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
    },*/
    devServer: {
        /* 自动打开浏览器 */
        open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8088,
        https: false,
        hotOnly: false,
        hot:true,
        overlay: {
            warnings: false,
            errors: true
        },
        /*假设你主机名为 localhost:8080 , 请求 API 的 url 是 http：//your_api_server.com/user/list
  '/proxy'：如果点击某个按钮，触发请求 API 事件，这时请求 url 是http：//localhost:8080/proxy/user/list。
  changeOrigin：如果 true ，那么 http：//localhost:8080/proxy/user/list 变为 http：//your_api_server.com/proxy/user/list 。但还不是我们要的 url 。
 pathRewrite：重写路径。匹配 /proxy ，然后变为'' ，那么 url 最终为 http：//your_api_server.com/user/list 。*/
        proxy: {
            '/api': {
                //target:'http://192.168.0.160:8030',
                target: 'http://localhost:8133', //  目标地址 测试地址
                ws: true, // 是否代理websockets
                changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
