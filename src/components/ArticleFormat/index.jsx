/* 
    此组件为文章的模板组件，包含了格式和样式，只需要传递所展现的文章数组即可

*/
import React from 'react'
import './index.scss'
// 1. 引入markdown-it库
import markdownIt from 'markdown-it'
import {EyeOutlined,LikeOutlined,CarryOutOutlined,DislikeOutlined,MessageOutlined} from '@ant-design/icons';
import { Card } from 'antd';
import { NavLink } from 'react-router-dom';
// 引入随机颜色
import { getColor } from '../../utils/random';
// 引入时间格式
import { dateFormatter } from '../../utils/dateFormat';
// 引入用户头像
import userImage from '../../assets/images/user.png'
import api from '../../api';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
export default function ArticleFormat(props) {
// 2. 生成实例对象
const md = new markdownIt()
// 3. 解析markdown语法
// const parse = (text) => setHtmlString(md.render(text));

  //获得父组件传递过来的文章数据
  const allComment=useSelector(state=>state.comments)
  const articles=props.articlesData
  const articleView=props.articleView
//   console.log(allComment);
  let flag=false

  const [list,setList]=useState([])
    // console.log(articles);
//   function newestList(){
//     setList(articles)
//   }
  
//  function hostestList(){
//     setList(articleView)
//     flag=true
//   }
//  

  // 点击阅读更多，即增加浏览量
  function handleViews(articleId){  
    api.increaseViews({id:articleId}).then(res=>{
    })

  }

  function getCurrentCommentNum(id){
    if(allComment)
    {
        const res=allComment.filter(item=>{
            return item.blog_id==id
        })
        return res.length
    }
    
  
  }
  useEffect(()=>{
    setList(articles)

  },[articles,articleView])
  return (
    <div  className="articles">
        
        <h1 className='title'><LikeOutlined className='icon' />最新文章</h1>
        {/* <div className="sorts"> */}
            {/* <NavLink className='newest' onClick={newestList}>最新文章</NavLink> */}
            {/* <NavLink className='hostest' onClick={hostestList}>最热文章</NavLink> */}
         {/* </div> */}
        {
            // !flag?
            articles.map((item,index)=>{
                return (
                    <Card key={index} style={{ width: 700 ,height:350}}>
                        {/* 右侧文章图片信息 */}
                        <div className="contentImg">
                                <img src={item.img} alt="" />
                            </div>
                            {/* 文章内容 */}
                            <div className="artileContent">
                                <h1>{item.title}</h1>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                
                                <div
                                 className='content'
                                // 1.md.render用来解析markdown语法, 得到h1,,h2等html字符串
                                // 2.dangerouslySetInnerHTML  将html字符串解析成真正的html标签
                                 dangerouslySetInnerHTML={{__html:md.render(item.content )}}
                                >
                                {}
                                </div>
                                <br />
                                    <div className='readMore' style={{background:getColor()}}>
                                        <NavLink to={`/article/${item.id}`}   onClick={()=>{handleViews(item.id)}} >
                                        <EyeOutlined />
                                        <span >阅读更多</span>
                                        </NavLink>
                                    </div>
                                {/*  文章信息*/}
                                <div className="articleDeatil">
                                    <div className="userInfo">
                                        <img src={userImage} alt="" />
                                        <span>{item.author}</span>
                                    </div>
                                    <div className="data">
                                        <CarryOutOutlined />
                                        <span>{dateFormatter(item.create_date,'yyyy-mm-dd HH:mm:ss')}</span>
                                    </div>
                                   <div className="view">
                                         <EyeOutlined />
                                        <span>{item.view}</span>
                                    </div>
                                    <div className="commentNum">
                                        <MessageOutlined />
                                          <span>{getCurrentCommentNum(item.id)}</span>
                                    </div>
                                    {/* <div className="dislike">
                                        <DislikeOutlined />
                                        <span>{item.dislike}</span>
                                    </div>
                                    <div className="like">
                                    <LikeOutlined />
                                        <span>{item.like}</span>
                                    </div> */}
                                </div>
                            </div>
                            
                    </Card>
                )
            })
            // :''
        }

    </div>
  )
}
