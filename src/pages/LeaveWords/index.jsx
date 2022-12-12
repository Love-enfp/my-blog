import React from 'react'
import PublicNav from '../../components/PublicNav'
import moment from 'moment'
import { useRef } from 'react';
import { Button, Form, Input ,Card,message,Pagination,Layout} from 'antd';
import api from '../../api';
import './index.scss'
import Hottest from '../../components/Hottest';
import { StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import FooterPart from '../../components/FooterPart';
import { useState } from 'react';
import { dateFormatter } from '../../utils/dateFormat';
import { useEffect } from 'react';
import axios from 'axios';
import SliderRight from '../../components/SliderRight'
import getMaxId from '../../utils/getMaxId'
import { ReactEmojiEditor } from 'react-emotor'
const { Header,  Content } = Layout;
const { TextArea } = Input;
export default function LeaveWords() {
    const [maincontent,setMainContent]=useState('')
    // 创建ref用于接收编辑框组件的节点对象,
    const emotor = useRef();
    //发表评论后刷新页面
    const [refresh,setRefsh]=useState(false)
    //存储当前的页码值
    const [page,setPage]=useState(1)
    // 存储当前页码的留言
    const [messageList,setMessageList]=useState([])
    // 存储当前页面评论的回复数据
    const [commentReply,setCommentReply]=useState([])
    // 存储所有的留言
    const [allMessagelist,setAllMessageList]=useState([])
      // 记录当所有的评论的数量 
     const [allCommentNum,setAllCommentNum] =useState(0)
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
  useEffect(()=>{
    setMainContent('')
    window.scrollTo(0, 0);
    api.geMessage({page}).then(res=>{
        // 更新所有的数据
      setAllMessageList(res.data.allMessage)
    //   更新当前页面的数据
      setMessageList(res.data.result)
       // 更新当前页面的评论回复数据
       setCommentReply(res.data.reply)
        //分页的总数，应该是一级评论的数量，所以这里取出一级评论 
       const parentReply=res.data.allMessage.filter(item=>{
        return item.parent_id==0
       })
    //    const allNum=getMaxId(parentReply)
       setAllCommentNum(parentReply)
    //    console.log(res.data.allMessage);
    })
  },[refresh,page])

  function submitComment(value){
    if(maincontent==='')
    {
        message.error('请输入内容')
    }
    else{

    
        // 通过moment获得当前时间
        let currentTime=moment().format('YYYY-MM-DD HH:mm:ss')
        const {nick,content}=value 
        let params={}
        // console.log(allArticleComment.length*1+1);
        if(replyid==-1&&replyEndid==-1)
        {
            params={
                id:allMessagelist.length===0 ? 0 : (getMaxId(allMessagelist)+1),
                nick:qqUserInfo.name?qqUserInfo.name:nick,
                email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                content:maincontent,
                avatar:qqImage,
                create_time:currentTime,
                parent_id:0,//注意，用0表示是一级评论，不是二级,
                origin_id:0
            }
            // console.log(params);
        }
        else if(flag==0&&replyid!==-1){
            params={
                id:allMessagelist.length===0 ? 0 : (getMaxId(allMessagelist)+1),
                nick:qqUserInfo.name?qqUserInfo.name:nick,
                email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                content:maincontent,
                avatar:qqImage,
                create_time:currentTime,
                parent_id:replyid,
                origin_id:0
            }
            console.log('二级评论提交的是',replyid,params);
            
        }
        else if(flag==1&&replyEndid!==-1)
        {
            params={
                id:allMessagelist.length===0 ? 0 : (getMaxId(allMessagelist)+1),
                nick:qqUserInfo.name?qqUserInfo.name:nick,
                email:qqUserInfo.qq?qqUserInfo.qq+"@qq.com":value.email,
                content:maincontent,
                avatar:qqImage,
                create_time:currentTime,
                parent_id:replyEndid,
                origin_id:originId,
            }
            
            console.log('三级评论提交的是',replyEndid,params);
        }
        if(replyid!==-1||replyEndid!==-1){
            console.log('@@',replyInfo);
            const {email}=replyInfo
            const {nick}=params
            let dataParams={
                email,
                nick
            }
            console.log("邮箱的回复",dataParams);
            api.submitEmail(dataParams).then((res)=>{
            })
        }
        console.log('提交的评论',params);
        api.submitMessage(params).then(res=>{
            if(res.data.status===200)
            {
                setRefsh(!refresh)
                message.success("留言成功！ ！")
                // 清空表单数据
                form.current.setFieldsValue({
                    nick:'',
                    email:'',
                    QQ:'',
                    content:'',
                    avatar:''
                })
                // console.log(maincontent);
                emotor.current.clean();
                // setMainContent(' gg')
                setqqImage('https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a')
                // 关闭二级回复表单
                setIsReply(false)
                setsThirdRepl(false)
                setReplyId(-1)
                setReplyEndid(-1)
                
            }
            else{
                message.success("留言失败！ ！")
                
            }
            
        })
    }
  }
// origin-id为谈话的最高级，求出其昵称
function getOriginIdNick(origin_id){
    // console.log(origin_id);
    // console.log(allArticleComment);
    let temp=[]
    if(allMessagelist!=[])
    {
        temp=allMessagelist.filter(item=>{
            return item.id*1==origin_id*1
        })
        // console.log(temp);
    }
    if(temp.length===1)
    {
        return temp[0].nick
    }
}
  function getAllQQIinfo(event){
      axios({
        method:'get',
        url:'https://api.usuuu.com/qq/'+event.target.value
     }).then(res=>{
        if(res.data.code===200)
        {console.log(122222222);
            // 更新qq相关信息
            setqqUserInfo(res.data.data)
            // 自动填充邮箱
            form.current.setFieldsValue({
                email:res.data.data.qq+'@qq.com',
                nick:res.data.data.name
            })
            // 自动填充头像
            setqqImage(res.data.data.avatar)
        }
        else{
            console.log(111111111);
                message.error('qq号输入错误！请重试')
        }
    })
  }

  function changePage(page){
    setPage(page)
  }
/* 点击的是一级评论，准备发布二级评论 */
function submitReply(item){
    // console.log('%%%%',item);
    const {id}=item
    console.log('当前评论的Id是',id,item);
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
// 组件内容改变回调函数
function contentOnChange(content) {
    
    setMainContent(content)
}
    
  return (
    <div className='leavewords'>
      <Layout>
        <Header>
          <PublicNav></PublicNav>
        </Header>
        <Content>
            
        <Card className='messageMenu' id="menuList">
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
                    <span>***{qqUserInfo.name}***</span>:
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
                        <Input placeholder="输入qq号可直接获得昵称和邮箱！(选填)" style={{width:200}}/>
                    </Form.Item>

                    <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        {
                          required: true,
                          message: '请输入邮箱',
                        },
                      ]}
                    >
                        <Input placeholder="请填写真实邮箱(必填)"/>
                    </Form.Item>
                </div>
                <div className="content">
                    <Form.Item >
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
        <div className="messageArea">
            <Card>
                <h1>留言区</h1>
                {
                    messageList.map((item,index)=>{
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
                                                
                                                {item.nick}
                                            </span>
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
                    {/* 如果写成messageList.length会报错，因为页面刚渲染时候，是读取不到messageList，所有要尽量避开length使用，直接调用状态就行 */}
                    <Pagination onChange={changePage}  total={allCommentNum.length}  pageSize={10}/>
                </div>
            </Card>
        </div>
            <Hottest></Hottest>
            <SliderRight></SliderRight>
        </Content>
        <FooterPart></FooterPart>
      </Layout>
        
    </div>
  )
}
