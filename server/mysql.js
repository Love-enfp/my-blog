/* 
    连接数据库
*/
// 导入mysql
const mysql=require('mysql')

// 创建数据库连接
const db=mysql.createConnection({
    host:'localhost',// 数据库的 IP 地址
    user:'root',// 登录数据库的账号
    password:'1234',// 登录数据库的密码
    database:'blog',// 指定要操作哪个数据库
    charset:'UTF8MB4_GENERAL_CI'
})

//封装数据库操作语句 sql语句 参数数组arr  callback成功函数结果
function sqlFun(sql,arr,callback){
    db.query(sql,arr,function(err,res){
        if(err)
        {
            console.log("数据库语句错误",err);
            return
        }
        callback(res)
    })
}

module.exports=sqlFun


// 测试是否连接成功
// db.query('select 1',(err,res)=>{
//     if(err) return console.log('错误',err);
//     console.log(res);
// })