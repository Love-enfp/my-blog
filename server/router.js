/* 
    路由模块（写所有挂载的具体路由）
*/
// 导入express
const express=require('express')
// 导入邮箱
const nodemailer = require("nodemailer");
// 创建路由对象
const router=express.Router()
// 连接数据库
const sqlFn=require('./mysql')
/*使用此中间件*/
const multiparty = require('connect-multiparty');
const multiparMiddleware=multiparty()
const path=require('path')
const fs=require('fs')
let OSS = require('ali-oss');
const { log } = require('console');

let client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-shanghai',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'LTAI5tNTGgSepk3u8iCLthM7',
  accessKeySecret: 'OAOcOcyf8uLTsMXN8CGDWKv8tDYV0O',
  bucket: 'wjg-blog'
});


// 挂载具体的路由
router.get('/test',(req,res)=>{
    
    res.send('访问成功')
})
/* 
游客登录
*/
router.get('/visitor',(req,res)=>{
    res.send({
        status:200,
        message:'游客访问成功',
        token:'asldkjfaiuelk',
        nick:'游客'
    })

})
/* 
管理员登录
*/
router.post('/login',(req,res)=>{
    const {username,password}=req.body
    console.log(username,password);
    const sql="select * from t_manager where username=? and password=?"
    const arr=[username,password]
    sqlFn(sql,arr,(result)=>{
        if(result.length>0)
        {
            res.send({
                status:200,
                message:'登录成功',
                token:'ashdf7asdf903rf90das9fsda09f8sd9af89as08e8a87fa8ds6f7ad',
                nick:username
            })
        }
        else{
            
                res.send({
                    status:500,
                    message:'数据不存在，获取失败'
                })
            
        }
    })
})
/* 
    获取文章接口
*/
router.get('/articles',(req,res)=>{
    const page=req.query.page
    const sqlLen2="select * from t_article order by view desc limit 5 offset " + (page*1-1)*5//获得所有的文章(浏览量热度排序)
    sqlFn(sqlLen2,null,allNumByView=>{
        const sqlLen="select * from t_article order by create_date desc"//获得所有的文章(最新时间排序)
        sqlFn(sqlLen,null,allNumByTime=>{
            const sql="select * from t_article order by create_date desc limit 5 offset " + (page*1-1)*5//一次取5条数据"(最新时间排序)
            sqlFn(sql,null,(result)=>{
                if(result.length>0)
                {
                    // ({})中的值为res.data的值
                    res.send({
                        status:200,
                        result,
                        allArticles:allNumByTime,
                        allNumByView:allNumByView
                    })
                }
                else
                {
                    res.send({
                        status:500,
                        message:'数据不存在，获取失败'
                    })
                }
            })
        })
    })
    
    

   
})
/* 
    获取文章浏览量热度接口
*/
router.get('/articlesview',(req,res)=>{
    const page=req.query.page
    const sqlLen2="select * from t_article order by view desc limit 5 offset " + (page*1-1)*5//获得所有的文章(浏览量热度排序)
    sqlFn(sqlLen2,null,(allNumByView)=>{
        const sql="select * from t_article order by create_date desc limit 5 offset " + (page*1-1)*5//一次取5条数据"(最新时间排序)
        sqlFn(sql,null,(result)=>{
            if(result.length>0)
            {
                // ({})中的值为res.data的值
                res.send({
                    status:200,
                    result,
                    allNumByView:allNumByView
                })
            }
            else
            {
                res.send({
                    status:500,
                    message:'数据不存在，获取失败'
                })
            }
        })
    })
           
 
})

/* 
    发布文章接口
*/
router.post('/publish',(req,res)=>{
    console.log('以下就是发布文章的内容啦---------------------');
    const {id,author,title,content,create_date,update_date,like,dislike,img,view,open}=req.body
    async function list () {
        // 因为client.list是个promise对象，所以必须用异步来写
        // 不带任何参数，默认最多返回100个文件。
        const result = await client.list();
        console.log('哈啊',result.objects);
        let url=[]
        url=result.objects.filter(item=>{
            return item.name===img
        })

        // 插入语句，必须包含所有的属性值，不然会报错
        console.log(id,author,title,content,create_date,update_date,like,dislike,img,view,open);
        const sql="insert into t_article values (?,?,?,?,?,?,?,?,?,?,?)"
        const arr=[id,author,title,content,create_date,update_date,like,dislike,url[0].url,view,open]
        sqlFn(sql,arr,(result)=>{
            if(result.affectedRows>0)
            {
                res.send({
                    status:200,
                    message:'文章发布成功！！'
                })
            }
        })
    }
    list();
})
/* 
    编辑文章接口
*/
router.post('/updatearticle',(req,res)=>{
    console.log('以下就是编辑文章的内容啦---------------------');
    const {id,author,title,content,create_date,update_date,like,dislike,img,view,open}=req.body
    // 如果改变图片样式了，传递过来的是图片名字，如果没有改变，传递过来的是url地址
    async function list () {
        // 因为client.list是个promise对象，所以必须用异步来写// 不带任何参数，默认最多返回100个文件。
        const result = await client.list();
        console.log('哈啊',result.objects);
        let url=[]
        url=result.objects.filter(item=>{
            return item.name===img||item.url===img//考虑图片是否改没改变
        })
        /* 很奇怪，这里不能加上like和dislike属性，不然就报错！！太坑了 */
        let sql="update t_article set author=? ,title=? ,content=? ,create_date=?, update_date=? ,img=? ,open=?where id=?"
        let arr=[author,title,content,create_date,update_date,url[0].url,open,id]
        sqlFn(sql,arr,(result)=>{
            if(result.affectedRows>0)
            {
                res.send({ 
                    status:200,
                    message:'文章编辑成功！！'
                })
            }
            else{
                res.send({ 
                    status:500,
                    message:'文章编辑失败'
                })
            }
        })
    }
    list();
})
/* 
获得所有的文章标签接口
*/
router.get('/labels',(req,res)=>{

    const sql="select * from t_label"
    sqlFn(sql,null,(result)=>{
        if(result.length>0)
        {
            // ({})中的值为res.data的值
            res.send({
                status:200,
                result
            })
        }
        else
        {
            res.send({
                status:500,
                message:'数据不存在，获取失败'
            })
        }
    })
})
/* 
删除文章接口
*/
router.post('/deletearticle',(req,res)=>{
    const {id}=req.body
    const sql="delete from t_article where id="+id
    sqlFn(sql,null,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'文章删除成功',
            })
        } else{
            res.send({
                status:500,
                message:'文章删除失败'
            })
        }
    })
})
/* 
添加文章标签接口
*/
router.post('/addlabel',(req,res)=>{
    console.log('以下就是标签的内容啦---------------------');
    let {id,blog_id,name}=req.body
    // 注意从，req,body中获得到的id，blog_id都为string类型，要强制传唤下啊！！
    console.log('接受到的是',id,blog_id,name);
    console.log('接受到的是',typeof(name));
    id=id*1
    // 当仅有一个参数时候，node获得是是一个字符串
    if(typeof(name)=='string')
    {
        const sql="insert into t_label values (?,?,?)"
        const arr=[id,blog_id,name]
        sqlFn(sql,arr,(result)=>{
            if(result.affectedRows>0)
            {
                console.log('一个标签添加成功！');
            }
        })
    }
    else {
        const n=name.length
        let i=0
        while(i<n)
        {
            const sql="insert into t_label values (?,?,?)"
            const arr=[id,blog_id,name[i]]
            sqlFn(sql,arr,(result)=>{
                if(result.affectedRows>0)
                {
                    console.log('一个标签添加成功！');
                }
            })
            id=id+1
            i=i+1
        }
    }
    
    res.send({
        status:200,
        message:'标签全部添加成功啦'
    })
    // --------------------------------------------下面是非循环 的
    // let {id,blog_id,name}=req.body
    // console.log(id,blog_id,name);
    // const n=name.length
    // let i=0
    //     const sql="insert into t_label values (?,?,?)"
    //     const arr=[id,blog_id,name[i]]
    //     sqlFn(sql,arr,(result)=>{
    //         i=i+1
    //         if(i<n)
    //         {
    //             id=id+1
    //             const sql="insert into t_label values (?,?,?)"
    //             const arr=[id,blog_id,name[i]]
    //             sqlFn(sql,arr,(result2)=>{
    //                 if(result2.affectedRows>0)
    //                 {
    //                     res.send({
    //                         status:200,
    //                         message:'第一个和第二个分类标签成功'
    //                     })
    //                 }
    //                 else{
    //                     res.send({
    //                         status:500,
    //                         message:'第一个和第二个分类标签失败'
    //                     })
    //                 }
    
    //             })
    //         }
    //         else{
    //             if(result.affectedRows>0)
    //             {
    //                 res.send({
    //                     status:200,
    //                     message:'一个分类标签成功'
    //                 })
    //             }
    //             else{
    //                 res.send({
    //                     status:500,
    //                     message:'一个分类标签失败'
    //                 })
    //             }

    //         }
           
           
    //     })
    
})
/* 
删除文章标签
*/
router.post('/deletelabel',(req,res)=>{
    
    const {name}=req.body
    const sql="delete from t_label where name=?"
    const arr=[name]
    sqlFn(sql,arr,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'删除成功'
            })
        }
    })
})
/* 
修改文章标签
*/
router.post('/updatelabel',(req,res)=>{
    
    const {oldname,newname}=req.body
    console.log(oldname,newname);
    const sql="update t_label set name= ? where name= ? "
    const arr=[newname,oldname]
    sqlFn(sql,arr,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'修改成功'
            })
        }
    })
})
/*
 提高浏览量接口
  */
router.post('/view',(req,res)=>{
    const id=req.body.id
    const sql="update t_article set view=view+1 where id ="+id
    sqlFn(sql,null,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'浏览量+1了'
            })
        }
        else{
            res.send({
                status:500,
                message:'失败'
            })
        }
    })
})
/* 
获取实时的浏览器
*/
router.post('/currentview',(req,res)=>{
    const id=req.body.id
    const sql="select view from t_article where id ="+id
    sqlFn(sql,null,(result)=>{
        if(result.length>0)
        {
            res.send({
                status:200,
                result,
                message:'获得了实时的浏览量'
            })
        }
        else{
            res.send({
                status:500,
                message:'失败'
            })
        }
    })
})


/* 
获得所有的文章分类接口
*/
router.get('/sorts',(req,res)=>{
    const sql="select * from t_sort"
    sqlFn(sql,null,(result)=>{
        if(result.length>0)
        {
            res.send({
                status:200,
                result
            })
        }
        else{
            res.send({
                status:500,
                message:'数据不存在，获取失败'
            })
        }
    })
    
})
/* 
添加文章分类接口
*/
router.post('/addsort',(req,res)=>{
    console.log('以下就是分类的的内容啦---------------------');
    const {id,blog_id,name}=req.body
    console.log(id,blog_id,name);
    const sql="insert into t_sort values (?,?,?)"
    const arr=[id,blog_id,name]
    sqlFn(sql,arr,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'分类添加成功'
            })
        }
        else{
            res.send({
                status:500,
                message:'分类添加失败'
            })
        }
    })
})
/* 
修改文章分类
*/
router.post('/updatesort',(req,res)=>{
    console.log("进来了");
    if(req.body.blog_id)
    {
        const {oldname,newname,blog_id,sort_id}=req.body
        console.log("进来了");
        console.log(oldname,newname,blog_id,sort_id);
        let sql="update t_sort set name= ?,blog_id=? where id= ? "
        let arr=[newname,blog_id,sort_id]
        sqlFn(sql,arr,(result)=>{
            if(result.affectedRows>0)
            {
                res.send({
                    status:200,
                    message:'编辑分类成功'
                })
            }
        })
    }
    else{
        const {oldname,newname}=req.body
        console.log(oldname,newname);
        const sql="update t_sort set name= ? where name= ? "
        const arr=[newname,oldname]
        // sqlFn(sql,arr,(result)=>{
        //     if(result.affectedRows>0)
        //     {
        //         res.send({
        //             status:200,
        //             message:'修改成功'
        //         })
        //     }
        // })
    }
    
})
/* 
删除文章分类
*/
router.post('/deletesort',(req,res)=>{
    
    const {name}=req.body
    const sql="delete from t_sort where name=?"
    const arr=[name]
    sqlFn(sql,arr,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'删除成功'
            })
        }
    })
})
/* 
获得所有的评论接口
*/
router.get('/comments',(req,res)=>{
   
    // 通过req.query拿到get请求的params参数
    let page=req.query.page||1//当前页码
    let articleId=req.query.articleId||1//当前文章的id
    // console.log('拿到的id是',articleId);
        //1.****************--------------------------------*************求得所有的评论
        const sqlLen="select * from t_comment order by create_time desc"
        sqlFn(sqlLen,null,allComment=>{
            //2.****************--------------------------------*************首先确定是哪篇文章，再提取对应评论的若干数目的数据(n*5)
            // console.log("第二层的id",articleId);
            const sql="select * from t_comment  where blog_id= "+articleId+"  order by blog_id asc limit 5 offset " + (page*1-1)*5//一次取5条数据
             sqlFn(sql,null,async (result)=>{
                const arr=[]
                for(let i=0;i<result.length;i++)
                {
                        let temp=await new Promise((resolve, reject)=>{
                            //3.********--------------------------------*********************求得当前(n*5)数据的二级评论数据，若无就返回空数组
                            sqlFn("select * from t_comment  where parent_id="+result[i].id,null,res=>{
                                resolve(res)//若不用async和await，res回调函数中的值我们是拿不到的
                            })
                        })
                        result[i].secondReply=temp//更新二级评论

                        if(result[i].secondReply!==[])//若存在二级评论
                        {
                            for(let j=0;j<result[i].secondReply.length;j++)
                            {
                                //4.********--------------------------------*********************求得当前(n*5)数据的三级评论数据，若无就返回空数组
                                let temp2=await new Promise((resolve, reject)=>{
                                    sqlFn("select * from t_comment  where parent_id="+result[i].secondReply[j].id,null,result=>{
                                        resolve(result)
                                    })
                                })
                                let temp10=await new Promise((resolve, reject)=>{
                                    sqlFn("select * from t_comment  where origin_id="+result[i].secondReply[j].id,null,result=>{
                                        resolve(result)
                                    })
                                })
                                result[i].secondReply[j].thirdReply=[...temp2,...temp10]
                            }
                        }
               }
               
            //将最终的result（包含二级评论，和三级评论）返回
                if(result.length>=0)
                {
                    res.send({
                        status:200,
                        result,
                        allComment:allComment,//返回所有的评论数据,
                        // reply//若本条评论有回复，则返回复内容
                    })
                }
                else{
                    res.send({
                        status:500,
                        message:'数据不存在，获取失败'
                    })
                }
               
            })
        })

})
/* 
删除评论功能
*/
router.post('/deletecomment',(req,res)=>{
    const {id}=req.body
    const sql="delete from t_comment where id="+id
    sqlFn(sql,null,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'评论删除成功',
            })
        } else{
            res.send({
                status:500,
                message:'评论删除失败'
            })
        }
    })
})


    

/* 
提交评论接口
*/
router.post('/submitComment',(req,res)=>{
    // 通过req.body拿到post请求的data参数
    let {id,nick,email,content,avatar,create_time,blog_id,parent_id,origin_id}=req.body
    const sql="insert into t_comment values (?,?,?,?,?,?,?,?,?)"
    const arr=[id,nick,email,content,avatar,create_time,blog_id,parent_id,origin_id]
    sqlFn(sql,arr,(result)=>{
        console.log('评论成功');
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'上传成功'
            })
        }
        else{
            res.send({
                status:500,
                message:'上传失败'
            })
        }
    })
 
})
// 回复评论邮箱提醒
router.post('/emailreply',(req,res)=>{
    // 通过req.body拿到post请求的data参数
    let {nick,email}=req.body
    // console.log('node收到的：',nick,email);
    // 定义邮件服务器服，个人建议使用QQ邮箱，用Yeah(网易)邮箱配置出现各种问题
    var transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        service: 'qq',
        secure: true,
        // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
        auth: {
            user:"1553857505@qq.com",
            pass: 'fgpsflojbywfgadc'
            // user:"1830765354@qq.com",
            // pass: 'ubcxhiqlejbtccfd'
        }
    });
    var mailOptions = {
        // 发送邮件的地址
        from: '"King"<1553857505@qq.com>', // login user must equal to this user
        // 接收邮件的地址
        to: email,  // xrj0830@gmail.com
        // 邮件主题
        subject: '小王客栈提醒您有新消息拉',
        // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
        html: nick+'回复了您的评论，快去看一下吧！(链接)'
    };
    // console.log(mailOptions);
    // 发送邮件，并有回调函数
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        res.send({
            status:200,
            message:'邮箱发送成功啦'
        })
        console.log('Message sent: ' + info.response);
    });
})
/* 
获得所有的留言接口
*/
router.get('/messages',(req,res)=>{
    
    let page=req.query.page||1//当前页码
    // 1.****************--------------------------------*************求得所有的留言数据
    const sqlLen="select * from t_message order by create_time desc"//获得所有的留言数目
    sqlFn(sqlLen,null,(allMessage)=>{
        // 注意哈，二级和三级评论我们是当做以及评论的子集出现的，所示我们的result中不应该包括他们，所以
        // 通过parent_id是否为0来区分。在评论中，是通过blog_id来区分的哟
        const sql="select * from t_message  where parent_id=0 order by create_time desc limit 10 offset " + (page*1-1)*10 //一次取10条数据
        sqlFn(sql,null,async (result)=>{
            const arr=[]
            for(let i=0;i<result.length;i++)
            {
                let temp=await new Promise((resolve, reject)=>{
                    //3.********--------------------------------*********************求得当前(n*5)数据的二级留言数据，若无就返回空数组
                    sqlFn("select * from t_message  where parent_id="+result[i].id,null,res=>{
                        resolve(res)//若不用async和await，res回调函数中的值我们是拿不到的
                    })
                })
                result[i].secondReply=temp//更新二级留言

                if(result[i].secondReply!==[])//若存在二级评论
                            {
                                for(let j=0;j<result[i].secondReply.length;j++)
                                {
                                    //4.********--------------------------------*********************求得当前(n*5)数据的三级评论数据，若无就返回空数组
                                    let temp2=await new Promise((resolve, reject)=>{
                                        sqlFn("select * from t_message  where parent_id="+result[i].secondReply[j].id,null,result=>{
                                            resolve(result)
                                        })
                                    })
                                    let temp10=await new Promise((resolve, reject)=>{
                                        sqlFn("select * from t_message  where origin_id="+result[i].secondReply[j].id,null,result=>{
                                            resolve(result)
                                        })
                                    })
                                    result[i].secondReply[j].thirdReply=[...temp2,...temp10]
                                }
                            }
            }
            //将最终的result（包含二级评论，和三级评论）返回
            if(result.length>=0)
            {
                res.send({
                    status:200,
                    result,
                    allMessage:allMessage,//返回所有的评论数据,
                    // reply//若本条评论有回复，则返回复内容
                })
            }
            else{
                res.send({
                    status:500,
                    message:'数据不存在，获取失败'
                })
            }

    })
    
})
})

/* 
发表留言
*/
router.post('/submitMessage',(req,res)=>{
    // 通过req.body拿到post请求的data参数
    let {id,nick,email,content,avatar,create_time,parent_id,origin_id}=req.body
    const sql="insert into t_message values (?,?,?,?,?,?,?,?)"
    const arr=[id,nick,email,content,avatar,create_time,parent_id,origin_id]
    sqlFn(sql,arr,(result)=>{
        console.log('留言成功');
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'上传成功'
            })
        }
        else{
            res.send({
                status:500,
                message:'上传失败'
            })
        }
    })
    
})
/* 
删除留言功能
*/
router.post('/deletemessage',(req,res)=>{
    const {id}=req.body
    const sql="delete from t_message where id="+id
    sqlFn(sql,null,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'评论删除成功',
            })
        } else{
            res.send({
                status:500,
                message:'评论删除失败'
            })
        }
    })
})

/* 
获得所有的弹幕
*/
router.get('/bulletscreen',(req,res)=>{
    const sql="select * from t_bulletscreen order by create_date desc"
    sqlFn(sql,null,(result)=>{
        if(result.length>0)
        {
            res.send({
                status:200,
                message:'请求成功',
                result
            })
        }
        else{
            res.send({
                status:500,
                message:'上传失败'
            })
        }
    })
})
/* 
添加弹幕
*/
router.post('/submitbullet',(req,res)=>{
    // 通过req.body拿到post请求的data参数
    const {id,content,create_date}=req.body
    const sql="insert into t_bulletscreen values (?,?,?)"
    const arr=[id,content,create_date]
    sqlFn(sql,arr,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'弹幕发表成功',
            })
        } else{
            res.send({
                status:500,
                message:'弹幕发表失败'
            })
        }
    })
})
/* 
修改弹幕
*/
router.post('/updatebullet',(req,res)=>{
    const {id,content,create_date}=req.body
    const sql='update t_bulletscreen set content = ? where id = ? '
    const arr=[content,id*1]
    sqlFn(sql,arr,(result)=>{
         const sql2="update t_bulletscreen set create_date = ? where id = ? "
         const arr2=[create_date,id*1]
        sqlFn(sql2,arr2,result2=>{
            // if(res.affectedRows>0)
            // {
                res.send({
                    status:200,
                    message:'弹幕修改成功',
                })
            // }
        })
    })
})
/* 
删除弹幕
*/
router.post('/deletebullet',(req,res)=>{
    const {id}=req.body
    const sql="delete from t_bulletscreen where id="+id
    sqlFn(sql,null,(result)=>{
        if(result.affectedRows>0)
        {
            res.send({
                status:200,
                message:'弹幕删除成功',
            })
        } else{
            res.send({
                status:500,
                message:'弹幕删除失败'
            })
        }
    })
})

// 接受图片
router.post('/upload',multiparMiddleware,(req, res) => {
    console.log(1);
    console.log(req.files.file)
    //上传的图片参数
    var file=req.files.file
    // //定义文件的存放路径
    var des_file=path.join('E:/my-blog-cover/image')+"\\"+file.originalFilename
    console.log(des_file)
    let url=[]
    // //将文件存入到本地服务器文件中
    fs.readFile(file.path,function(err,data){
            
            fs.writeFile(des_file,data,function(err){
            console.log(des_file);
            if(err){
                res.json({code:1});
                return
            }
            else{

                 async function put () {
                    try {
                      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
                      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
                      let result= await client.put(file.originalFilename, path.normalize("E:\\my-blog-cover\\image\\"+file.originalFilename));

                     
                    } catch (e) {
                      console.log(e);
                    }
                    // console.log("输出的结果是",result);
                  }
                  put();
                  console.log('----------',des_file);

                

                res.send({
                    message:'成功'
                })
            }
        })
    })

   
   
    // client.list();
    //将图片地址存放地址返回
    // res.json({
    //     code:0,
    //     url:`http://localhost:8080/public/${file.originalFilename}`
    // })
    // console.log(result);
})

// 向外导出路由对象
module.exports=router