const { createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api11', { 
            target: 'http://portalweather.comsys.net.cn/',
            changeOrigin: true,
            pathRewrite: {'^/api11': '' }
        }),
        createProxyMiddleware('/api13', { 
            target: 'https://www.mxnzp.com/',
            changeOrigin: true,
            pathRewrite: {'^/api13': '' }
        }),
        createProxyMiddleware('/api16', { 
            target: ' https://api.uomg.com/',
            changeOrigin: true,
            pathRewrite: {'^/api16': '' }
        }),
        createProxyMiddleware('/api17', { 
            target: '  https://api.oick.cn/',
            changeOrigin: true,
            pathRewrite: {'^/api17': '' }
        }),

       
    )
}
