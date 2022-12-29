import './index.scss'
import React from 'react'
import api from '../../api/index'
import moment from 'moment'
import { Button, Form, Input ,Card,message,Pagination} from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { dateFormatter } from '../../utils/dateFormat';
import getMaxId from '../../utils/getMaxId'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { initComment } from '../../redux/actions/comment';
import { ReactEmojiEditor } from 'react-emotor'
import { ReactEmojiShow } from 'react-emotor';
const { TextArea } = Input;
export default function Comment(props) {
  const dispatch=useDispatch()
  const [maincontent,setMainContent]=useState('')
    // 创建ref用于接收编辑框组件的节点对象,
  const emotor = useRef();
  // 记录当前文章的评论的数量 
  const [allCommentNum,setAllCommentNum] =useState(0)
  //获得当前文章的id值
  const articleId=props.data*1//转换为整型、
//   console.log('!!!!',articleId);
  //存储当前的页码值
  const [page,setPage]=useState(1)
  // 记录所有文章的评论
  const [allArticleComment,setAllArticleComment]=useState([])
  //存储当前页面的所有评论(是按页码的，是n*5的倍数条)
  const [commentList,setCommentList]=useState([])
  // 存储当前页面评论的回复数据
  const [commentReply,setCommentReply]=useState([])
  //发表评论后刷新页面
  const [refresh,setRefsh]=useState(false)
  // 存储qq用户相关信息
  const [qqUserInfo,setqqUserInfo]=useState({})
  //存储qq用户的头像
  const [qqImage,setqqImage]=useState('https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a')
//   获得form表单元素
  const form=useRef()
  //   获得第二个form表单元素
  const formtwo=useRef()
//   标志是否点击二级回复按钮
const [isReply,setIsReply]=useState(false)
//   标志是否点击三级回复按钮
const [isThirdReply,setsThirdRepl]=useState(false)
// 存储二级回复对象的id，并不是文章id
const [replyid,setReplyId]=useState(-1)
// 存储三级回复对象的id，并不是文章id
const [replyEndid,setReplyEndid]=useState(-1)
// 存储待回复的消息
const [replyInfo,setReplyInfo]=useState({})
  //输入完qq号失去焦点获得相关信息
  const [flag,setFlag]=useState(0)

    const [originId,setOriginId]=useState(0)

    // console.log(2);
  function getAllQQIinfo(event){
    axios({
        method:'get',
        url:'https://api.usuuu.com/qq/'+event.target.value
    }).then(res=>{
        // console.log(res.data);
        if(res.data.code===200)
        {
            if(res.data.data.name==' ')
            {
                message.error("请重新输入")
            }
            else{
                // 更新qq相关信息
                setqqUserInfo(res.data.data)
                // 自动填充邮箱和昵称
                form.current.setFieldsValue({
                    email:res.data.data.qq+'@qq.com',
                    nick:res.data.data.name
                })
                // 自动填充头像
                setqqImage(res.data.data.avatar)
            }
            
        }
       
    })
  }


  useEffect(()=>{
   

    api.getComments({page,articleId}).then(res=>{
        if(res.data.status===200)
        {
                // 从当前页码下获得的文章中（假如第二页，就得到前10条数据，是按blog_id排序得到），过滤出来当前文章的评论数据
                const arr=res.data.result.filter((item)=>{
                    return item.blog_id===articleId
                })
                // console.log(arr);
                arr.sort((a,b)=>{return b.id-a.id})
                // console.log(arr);

                // 从所有的评论中获得当前文章的评论数据
                const currentComments=res.data.allComment.filter((item)=>{
                    return item.blog_id===articleId
                })
                // 更新所有的评论
                setAllArticleComment(res.data.allComment)
                // 更新当前文章的评论数量
                setAllCommentNum(currentComments.length)
                // 更新当前页面的评论数据
                setCommentList(arr)
                // 更新当前页面的评论回复数据
                setCommentReply(res.data.reply)

                props.getCommentNum(currentComments.length)

                dispatch(initComment(res.data.allComment))
        }
        
    })

    if(localStorage.getItem('userinfo'))
    {
            let userinfo=JSON.parse(localStorage.getItem('userinfo')) 
            // 从邮箱中获得qq
            let email=userinfo.email
            var tag = email.indexOf("@")
            let qq=email.slice(0, tag);
            // console.log(qq);
            // 回显评论区用户数据
            
            form.current.setFieldsValue({
                nick:userinfo.nick,
                email:userinfo.email,
                QQ:qq,
                // avatar:"https://q1.qlogo.cn/g?b=qq&nk=1553857505&s=100",
            })
            setqqImage(userinfo.avatar)
    }
    
    
  },[page,refresh])//eslint-disable-line
  //当更改页码和上传评论后，，就刷新页面，重新渲染

  /* 翻页功能 */
  function changePage(page){
    setPage(page)
  }
  
  /* 点击的是一级评论，准备发布二级评论 */
  function submitReply(item){
    // console.log('%%%%',item);
    const {id}=item
    // console.log('当前评论的Id是',id,item);
    setIsReply(true)
    setReplyId(id)
    setFlag(0)
    setReplyInfo(item)
    scrollToAnchor("menuList", true)
  }
  /* 点击的是二级评论，准备发布三级评论 */
  function submitTwodReply(item){
    const {id}=item
    // console.log('当前评论的Id是',id,item);
    setsThirdRepl(true)
    setReplyEndid(id)
    setFlag(1)
    setReplyInfo(item)
    scrollToAnchor("menuList", true)
  }
  /* 点击的是三级评论，准备发布三级评论 */
  function submitThirdReply(item,i){
    // console.log(i);
    const {id,parent_id}=item
    // console.log('当前评论的Id是',parent_id,item);
    setsThirdRepl(true)
    setReplyEndid(id)
    setFlag(1)
    setReplyInfo(item)
    scrollToAnchor("menuList", true)
    setOriginId(i.id)//i为当前对话的最终父亲，不是回复对象！
  }
  /* 实现点击回复按钮，向上跳转到表单功能 */
  function scrollToAnchor(anchorName,smooth){
    // scrollToAnchor为h5新增API
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({block: 'start', behavior: smooth? 'smooth': 'auto'});
        // block:表示滚动到锚点的顶部或者底部，start/end
        // behavior:表示滚动的效果，auto/instant/smooth(滚动效果)
      }
    }
  }
  
  /* 提交评论 */
  function submitComment(value){
    if(maincontent==='')
             message.error("请输入内容")
    else
    {

    
            // console.log('内容为',maincontent);
            
            // console.log(value);
            // 通过moment获得当前时间
            let currentTime=moment().format('YYYY-MM-DD HH:mm:ss')
            const {nick}=value
            // console.log(nick,content,avatar,qqImage);
            let params={}
            // console.log(allArticleComment.length*1+1);
            
            if(replyid==-1&&replyEndid==-1)
            {
                // console.log(allArticleComment);
                params={
                    id:allArticleComment.length===0 ? 0 : (getMaxId(allArticleComment)+1),
                    nick:qqUserInfo.name?qqUserInfo.name:value.nick,
                    email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                    content:maincontent,
                    avatar:qqImage,
                    blog_id:articleId,
                    create_time:currentTime,
                    parent_id:0,//注意，用0表示是一级评论，不是二级,
                    origin_id:0
                }
                // console.log(getMaxId(allArticleComment));
                // console.log('提交的评论信息是',params);
                // 一级评论同样需要邮箱提醒博主,那固定回复对象就是博主啦！
            const email="1553857505@qq.com"
            const nick=value.nick
            let dataParams={
                email,
                nick,
            }
            // console.log('传递的消息是',dataParams);

            api.submitEmail(dataParams).then((res)=>{
                // console.log(res.data);
            })
            }
            else if(flag==0&&replyid!==-1){
                params={
                    id:allArticleComment.length===0 ? 0 : (getMaxId(allArticleComment)+1),
                    nick:qqUserInfo.name?qqUserInfo.name:nick,
                    email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                    content:maincontent,
                    avatar:qqImage,
                    blog_id:0,//注意，论文文章若为0说明是二级评论
                    create_time:currentTime,
                    parent_id:replyid,
                    origin_id:0
                }
                // console.log('二级评论提交的是',replyid,params);
            
            }
            else if(flag==1&&replyEndid!==-1)
            {
                params={
                    id:allArticleComment.length===0 ? 0 : (getMaxId(allArticleComment)+1),
                    nick:qqUserInfo.name?qqUserInfo.name:nick,
                    email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                    content:maincontent,
                    avatar:qqImage,
                    blog_id:0,//注意，论文文章若为0说明是二级评论
                    create_time:currentTime,
                    parent_id:replyEndid,
                    origin_id:originId,
                }
                
                // console.log('三级评论提交的是',replyEndid,params);
            }
            // 当点击回复的时候
            if(replyid!==-1||replyEndid!==-1){
                const {email}=replyInfo
                const {nick}=params
                let dataParams={
                    email,
                    nick
                }
                // console.log('传递的消息是',dataParams);

                api.submitEmail(dataParams).then((res)=>{
                    // console.log(res.data);
                })
            }
            // console.log('提交的评论信息是',params);

            // 个人信息已经存在
            if(localStorage.getItem('userinfo')){
               localStorage.removeItem('userinfo')//先删除原有信息
            }
            // 将新的个人信息存储大到localsotrge中
            const userinfo={
                nick: params.nick,
                qq:qqUserInfo.qq,
                email:params.email,
                avatar:params.avatar
            }
            // localStorage中存入 JSON 对象，需先转换成 JSON 字符串，再写入，在读取时再转换成 JSON 对象：（否则会报错）
             localStorage.setItem('userinfo',JSON.stringify(userinfo) )
             localStorage.setItem('username',JSON.stringify(userinfo.nick) )


            // console.log(getMaxId(allArtircleComment));
            api.submitComment(params).then(res=>{
                if(res.data.status===200)
                {
                    setRefsh(!refresh)
                    message.success("评论成功！ ！")
                    // 清空表单数据
                    form.current.setFieldsValue({
                        // nick:'',
                        // email:'',
                        // QQ:'',
                        content:'',
                        // avatar:''
                    })
                    emotor.current.clean();
                    // setqqImage('https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a')
                    // 关闭二级回复表单
                    setIsReply(false)
                    setsThirdRepl(false)
                    setReplyId(-1)
                    setReplyEndid(-1)
                }
                else{
                    message.success("评论失败！ ！")
                    
                }
                
            })
    }
  }
// origin-id为谈话的最高级，求出其昵称
  function getOriginIdNick(origin_id){
    // console.log(origin_id);
    // console.log(allArticleComment);
    let temp=[]
    if(allArticleComment!=[])
    {
        temp=allArticleComment.filter(item=>{
            return item.id*1==origin_id*1
        })
        // console.log(temp);
    }
    if(temp.length===1)
    {
        return temp[0].nick
    }

  }
   // 组件内容改变回调函数
   function contentOnChange(content) {
    setMainContent(content)
  }



  return (
    <div className='commentAll'>
         
        <Card className='commentMenu' id="menuList">
            <div className="help">
                <p>您可以选择两种方式进行评论哟：</p>
                <p><StarOutlined className='icon'/>1.直接输入<span>qq号</span> ，获得昵称、邮箱、头像</p>
                <p><StarOutlined className='icon'/>2.忽略qq,直接输入自定义的<span>昵称</span>和真实的<span>qq邮箱</span></p>
                <p><StarOutlined className='icon'/>注意：评论回复将通过<span>qq邮箱</span>提醒您哟</p>
            </div>
            <div className="nick">
                {
                    // 如果头像是默认的，说明尚未评论或者评论成功，则不显示昵称
                    qqImage!=='https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a'?
                    <span>***{qqUserInfo.name||JSON.parse(localStorage.getItem('username'))}***</span>:
                    ''
                }
                
            </div>
            <h1>欢迎留下您的小脚印哟(*^▽^*)</h1>
            {
                isReply||isThirdReply?
                <div className="replyObject">
                    <span>回复：</span>
                    <span className="username">{replyInfo.nick}&nbsp;&nbsp;&nbsp;{dateFormatter(replyInfo.create_time) }</span>
                    <div className="content">
                        
                        <span>{replyInfo.content}</span>
                    </div>
                </div>
                
                :''
            }
            <Form
            
            ref={form}
            name="basic"
            autoComplete="off"
            onFinish={submitComment}
            >
                <div className="userInfo">
                    <Form.Item
                        label="头像"
                        name="avatar"
                    >
                        <div className="img">
                            <img style={{height:80,width:80}} src={qqImage} alt="" />
                        </div>
                    </Form.Item>

                    <Form.Item
                    label="昵称"
                    name="nick"
                    rules={[
                        {
                          required: true,
                          message: '请输入昵称',
                        },
                      ]}
                    >
                        <Input placeholder="请输入昵称(必填)" style={{width:140}}/>
                    </Form.Item>

                    <Form.Item
                    label="QQ:"
                    name="QQ"
                    onBlur={(event)=>getAllQQIinfo(event)}
                    >
                        <Input placeholder="输入qq号可直接获得昵称和邮箱！(选填)" style={{width:300}}/>
                    </Form.Item>

                    <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        {
                          required: true,
                          message: '请输入文章邮箱',
                        },
                      ]}
                    >
                        <Input placeholder="请填写真实邮箱(必填)"/>
                    </Form.Item>
                </div>
                <div className="content">
                    <Form.Item 
                    rules={[
                        {
                          required: true,
                          message: '请输入文章内容',
                        },
                      ]}
                    >
                        {/* 用的大佬封装的表情组件 */}
                        <ReactEmojiEditor
                            ref={emotor}
                            className='myClassName'
                            id="myEmotor"
                            value={maincontent}
                            onChange={content => contentOnChange(content)}
                        />
                        {/* <ReactEmojiShow
                            content={maincontent}
                        /> */}
                    </Form.Item>

                </div>
                <div className="submit">
                    <Form.Item
                        >
                        <Button type="primary" htmlType="submit">
                        {
                                (isThirdReply||isReply)?'回复留言':'发表留言'
                            }
                        </Button>
                    </Form.Item>
                </div>
                
            </Form>
        </Card>
        <div className="commentArea">
            <Card>
                <h1>评论区</h1>
                {
                    commentList.map((item,index)=>{
                        return (
                            <div className="commentandreply" key={index}>
                                {/* 一级评论区 */}
                                <div className='commentOne' >
                                    <div className="left">
                                        <div className="img">
                                            <img src={item.avatar} alt="" style={{width:50,height:50}}/>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="info">
                                            <span className='userName'>
                                                 <i>
                                                {
                                                    item.nick==="钟爱enfp女孩"?
                                                    '☆博主☆ '
                                                    :''
                                                }
                                                </i>
                                                {item.nick}</span>
                                            <span>{dateFormatter(item.create_time)}</span>
                                        </div>
                                        <div className="content">
                                            <span>{item.content}</span>
                                            <Link onClick={()=>submitReply(item)} >
                                                <p>回复</p> 
                                            </Link>
                                            
                                            
                                        </div>
                                   
                                    </div>
                                
                                 </div>
                                 <div className="commentReply">
                                        {
                                            item.secondReply!==[]?
                                            item.secondReply.map((i,j)=>{
                                                return(
                                                        i.parent_id===item.id?
                                                        (
                                                            /* 二级评论区 */
                                                            <div className="twoandthird" key={j}>
                                                                <div className='reply' >
                                                                        <div className="left">
                                                                            <div className="img">
                                                                                <img src={i.avatar} alt="" style={{width:50,height:50}}/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="right">
                                                                            <div className="info">
                                                                                <span className='userName'>
                                                                                <i>
                                                                                {
                                                                                    i.nick==="钟爱enfp女孩"?
                                                                                    '☆博主☆ '
                                                                                    :''
                                                                                }
                                                                                </i>
                                                                                    {i.nick}
                                                                                </span>
                                                                                <span>{dateFormatter(i.create_time)}</span>
                                                                            </div>
                                                                            <div className="content">
                                                                                <span>{i.content}</span>
                                                                                {/* 第一个参数任意，第二个为事件对象（可不传） */}
                                                                                <Link onClick={()=>submitTwodReply(i)} >
                                                                                    <p>回复</p> 
                                                                                </Link>
                                                                                 
                                                                            </div>
                                                                        </div>
                                                                </div>
                                                                {/* 三级评论区 */}
                                                                <div className="thirdReply">
                                                                    {
                                                                        item.secondReply[j].thirdReply!==[]?
                                                                        item.secondReply[j].thirdReply.map((one,k)=>{
                                                                            return (
                                                                                <div className="endReply" key={k}>
                                                                                    <div className="left">
                                                                                        <div className="img">
                                                                                            <img src={one.avatar} alt="" style={{width:50,height:50}}/>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="right">
                                                                                        <div className="info">
                                                                                            <span className='userName'>
                                                                                            <i>
                                                                                            {
                                                                                                one.nick==="钟爱enfp女孩"?
                                                                                                '☆博主☆ '
                                                                                                :''
                                                                                            }
                                                                                            </i>
                                                                                                {one.nick}
                                                                                                <span className='replyTitle'>回复</span> 
                                                                                               
                                                                                                {
                                                                                                    one.nick==i.nick?
                                                                                                    item.secondReply[j].thirdReply[0].nick
                                                                                                    :
                                                                                                    (
                                                                                                        one.origin_id===i.origin_id?
                                                                                                        (<i>
                                                                                                            {
                                                                                                                i.nick==="钟爱enfp女孩"?
                                                                                                                '☆博主☆ '
                                                                                                                :''
                                                                                                            } <span>{i.nick}</span>
                                                                                                        </i>
                                                                                                        )
                                                                                                        :getOriginIdNick(one.parent_id)
                                                                                                        
                                                                                                    )
                                                                                                }
                                                                                            </span>
                                                                                            <span>{dateFormatter(one.create_time)}</span>
                                                                                        </div>
                                                                                        <div className="content">
                                                                                            <span>{one.content}</span>
                                                                                            {/* 第一个参数任意，第二个为事件对象（可不传） */}
                                                                                            <Link onClick={()=>submitThirdReply(one,i)} >
                                                                                                <p>回复</p> 
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                        :
                                                                        ''
                                                                    }
                                                                </div>
                                                            </div>
                                                            
                                                        )
                                                        :
                                                         ''
                                                ) 
            
                                            })
                                            :''
                                        }
                                </div>
                                 
                            </div>
                            
                        )
                    })
                }
              
                <div className="page">
                    <Pagination onChange={changePage}  total={allCommentNum}  pageSize={5}/>
                </div>
            </Card>
        
        </div>
    </div>
  )
}


/* 

    多级回复功能实现！
    评论有3个关键字段,分别是id，parent_id,origin_id
    对于一级评论来说-----点击发布评论按钮，（评论文章）：parent_id,origin_id均为0
    对于二级评论来说-----点击一级评论的回复按钮（回复 文章的评论）：parent_id为回复对象的id,  origin_id为0
    对于三级评论来说------点击二级评论的回复按钮（回复 二级评论）:parent_id为回复对象的id，origin_id为属于哪一个对话中！！也就是第一个评论的

*/