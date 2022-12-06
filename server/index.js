// 导入express
const express =require('express')
// 创建web服务器app
const app=express()
// 在路由之前，配置cors中间件，解决跨域问题
const cors=require('cors')
// body-parser，作用是对post请求的请求体进行解析。
const bodyParser=require("body-parser")



app.use(bodyParser.urlencoded({extended:true}))

// 注册cors
app.use(cors())
// 导入路由模块
const router=require('./router')
// 注册路由模块，并添加访问前缀
app.use('/api',router)
// 监听服务器
app.listen(80,function(){
    console.log('服务器访问在http:127.0.0.1 ');
})