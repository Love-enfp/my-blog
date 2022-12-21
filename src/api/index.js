import axios from '../utils/request'

/* 
    路径地址
*/
const base={
    baseUrl:"http://1.117.109.184:3008",
    articles:"/api/articles",
    articlesview:'/api/articlesview',
    labels:"/api/labels",
    sorts:"/api/sorts",
    comments:'/api/comments',
    submitComment:'/api/submitComment',
    messages:'/api/messages',
    submitMessage:'/api/submitMessage',
    bulletscreen:'/api/bulletscreen',
    submitbullet:'/api/submitbullet',
    emailreply:'/api/emailreply',
    view:'/api/view',
    currentView:'/api/currentview',
    buildlog:'/api/buildlog'
}


/* 
    请求方法
*/

const api={
    // 获取文章列表
    getArticles(params){
        return axios({
            method:'get',
            url: base.baseUrl+base.articles,
            params
        })
    },
    // 获取文章列表(按热度排行)
    getArticlesView(params){
        return axios({
            method:'get',
            url: base.baseUrl+base.articlesview,
            params
        })
    },
    getLabels(){
        return axios({
            method:'get',
            url:base.baseUrl+base.labels
        })
    },

    getSorts(){
        return axios({
            method:'get',
            url:base.baseUrl+base.sorts
        })
    },

    getComments(params){
        return axios({
            method:'get',
            url:base.baseUrl+base.comments,
            params//get请求传参，用paraams接受,且接收值必须是对象形式！
        })
    },
    // 提交评论
    submitComment(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.submitComment,
            data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
        })
    },

    // 获得留言
    geMessage(params){
        return axios({
            method:'get',
            url:base.baseUrl+base.messages,
            params//get请求传参，用paraams接受,且接收值必须是对象形式！
        })
    },
    // 提交留言
    submitMessage(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.submitMessage,
            data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
        })
    },
    // 获得弹幕
    getBulletScreen(){
        return axios({
            method:'get',
            url:base.baseUrl+base.bulletscreen
        })
    },
    //发表弹幕
    submitBulletScreen(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.submitbullet,
            data:params
        })
    },
    // 回复评论，发送邮寄
    submitEmail(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.emailreply,
            data:params
        })
    },
    // 点击文章详情，提高浏览量
    increaseViews(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.view,
            data:params
        })
    },
    // 获得实时的浏览量
    getCurrentView(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.currentView,
            data:params
        })
    },
    
    // 获得建站日志
    getBuildLog(){
        return axios({
            method:'get',
            url:base.baseUrl+base.buildlog
        })
    }

}

export default api