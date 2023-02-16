import React from 'react'
import moment from 'moment'
import { useRef } from 'react';
import { Button, Form, Input, Card, message, Pagination, Layout } from 'antd';
import api from '../../api';
import './index.scss'
import { StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { dateFormatter } from '../../utils/dateFormat';
import { useEffect } from 'react';
import axios from 'axios';
import SliderRight from '../../components/SliderRight'
import getMaxId from '../../utils/getMaxId'
import { ReactEmojiEditor } from 'react-emotor'
import FooterPart from '../../components/FooterPart';
import Hottest from '../../components/Hottest';
import PublicNav from '../../components/PublicNav'
const { Header, Content } = Layout;
export default function LeaveWords() {
    //存储文本框中留言内容
    const [maincontent, setMainContent] = useState('')
    //创建ref用于接收编辑框组件的节点对象,
    const emotor = useRef();
    //发表留言后刷新页面
    const [refresh, setRefsh] = useState(false)
    //存储当前的页码值
    const [page, setPage] = useState(1)
    //存储当前页码的留言
    const [messageList, setMessageList] = useState([])
    //存储所有的留言
    const [allMessagelist, setAllMessageList] = useState([])
    //记录当所有的留言的数量 
    const [allCommentNum, setAllCommentNum] = useState(0)
    //存储qq用户相关信息
    const [qqUserInfo, setqqUserInfo] = useState({})
    //存储默认qq用户头像地址
    const [qqImage, setqqImage] = useState('https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a')
    //获得form表单元素
    const form = useRef()
    //标志是否点击二级回复按钮
    const [isReply, setIsReply] = useState(false)
    //标志是否点击三级回复按钮
    const [isThirdReply, setsThirdRepl] = useState(false)
    //存储二级回复对象的id，并不是文章id
    const [replyid, setReplyId] = useState(-1)
    //存储三级回复对象的id，并不是文章id
    const [replyEndid, setReplyEndid] = useState(-1)
    //存储储回复对象的信息
    const [replyInfo, setReplyInfo] = useState({})
    //输入完qq号失去焦点获得相关信息
    const [flag, setFlag] = useState(0)
    //存储多级留言的源id
    const [originId, setOriginId] = useState(0)
    useEffect(() => {
        // 首先清空留言区内容
        setMainContent('')
        // 滚动到文档中的某个坐标
        window.scrollTo(0, 0);
        api.geMessage({ page }).then(res => {
            // 更新所有的数据
            setAllMessageList(res.data.allMessage)
            // 更新当前页面的数据
            setMessageList(res.data.result)
            //分页所需要数据的总数，这里应该是一级留言的数量，所以这里取出一级留言 
            const parentReply = res.data.allMessage.filter(item => {
                return item.parent_id == 0
            })
            // 存储一级留言内容
            setAllCommentNum(parentReply)
        })

        // 页面加载初试留言信息
        if (localStorage.getItem('userinfo')) {
            let userinfo = JSON.parse(localStorage.getItem('userinfo'))
            // 从邮箱中获得qq
            let email = userinfo.email
            var tag = email.indexOf("@")
            let qq = email.slice(0, tag);

            // 初始化留言用户信息
            form.current.setFieldsValue({
                nick: userinfo.nick,
                email: userinfo.email,
                QQ: qq,
            })
            setqqImage(userinfo.avatar)
        }

    }, [refresh, page])

    function submitComment(value) {
        if (maincontent === '') {
            message.error('请输入内容')
        }
        else {
            // 通过moment插件获得当前时间
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            let params = {}
            // 提交一级留言
            if (replyid == -1 && replyEndid == -1) {
                params = {
                    id: allMessagelist.length === 0 ? 0 : (getMaxId(allMessagelist) + 1),
                    nick: qqUserInfo.name ? qqUserInfo.name : value.nick,
                    email: qqUserInfo.qq ? qqUserInfo.qq + "@qq.com" : value.email,
                    content: maincontent,
                    avatar: qqImage,
                    create_time: currentTime,
                    parent_id: 0,//注意，用0表示是一级留言
                    origin_id: 0
                }
                // 一级评论同样需要邮箱提醒博主,那固定回复对象就是博主啦！
                const email = "1553857505@qq.com"
                const nick = value.nick
                let dataParams = {
                    email,
                    nick,
                    tag: 'leavewords',
                    id: ''
                }
                api.submitEmail(dataParams).then((res) => {
                })
            }
             // 提交二级留言
            else if (flag == 0 && replyid !== -1) {
                params = {
                    id: allMessagelist.length === 0 ? 0 : (getMaxId(allMessagelist) + 1),
                    nick: qqUserInfo.name ? qqUserInfo.name : value.nick,
                    email: qqUserInfo.qq ? qqUserInfo.qq + "@qq.com" : value.email,
                    content: maincontent,
                    avatar: qqImage,
                    create_time: currentTime,
                    parent_id: replyid,
                    origin_id: 0,
                }
            }
            // 提交三级留言
            else if (flag == 1 && replyEndid !== -1) {
                params = {
                    id: allMessagelist.length === 0 ? 0 : (getMaxId(allMessagelist) + 1),
                    nick: qqUserInfo.name ? qqUserInfo.name : value.nick,
                    email: qqUserInfo.qq ? qqUserInfo.qq + "@qq.com" : value.email,
                    content: maincontent,
                    avatar: qqImage,
                    create_time: currentTime,
                    parent_id: replyEndid,
                    origin_id: originId,
                }
            }
            // 只要点击了任何评论的回复按钮，都会邮箱通知
            if (replyid !== -1 || replyEndid !== -1) {
                const { email } = replyInfo
                const { nick } = params
                let dataParams = {
                    email,
                    nick,
                    tag: 'leavewords',
                    id: ''
                }
                api.submitEmail(dataParams).then((res) => {
                })
            }
            // 个人信息已经存在
            if (localStorage.getItem('userinfo')) {
                localStorage.removeItem('userinfo')//先删除原有信息
            }
            // 将新的个人信息存储大到localsotrge中
            const userinfo = {
                nick: params.nick,
                qq: qqUserInfo.qq,
                email: params.email,
                avatar: params.avatar
            }
            // localStorage中存入 JSON 对象，需先转换成 JSON 字符串，再写入，在读取时再转换成 JSON 对象：（否则会报错）
            localStorage.setItem('userinfo', JSON.stringify(userinfo))
            // 用来显示欢迎词，对应的用户名
            localStorage.setItem('username', JSON.stringify(userinfo.nick))
            // 提交留言
            api.submitMessage(params).then(res => {
                if (res.data.status === 200) {
                    setRefsh(!refresh)
                    message.success("留言成功！ ！")
                    // 清空表单数据
                    form.current.setFieldsValue({
                        // nick:'',
                        // email:'',
                        // QQ:'',
                        content: '',
                        // avatar:''
                    })
                    emotor.current.clean();
                    // 状态都复原
                    setIsReply(false)
                    setsThirdRepl(false)
                    setReplyId(-1)
                    setReplyEndid(-1)

                }
                else {
                    message.success("留言失败！ ！")

                }

            })
        }
    }
    // origin-id为三级评论的最高级，求出其昵称
    function getOriginIdNick(origin_id) {
        let temp = []
        if (allMessagelist != []) {
            temp = allMessagelist.filter(item => {
                return item.id * 1 == origin_id * 1
            })
        }
        if (temp.length === 1) {
            return temp[0].nick
        }
    }
    function getAllQQIinfo(event) {
        axios({
            method: 'get',
            url: 'https://api.usuuu.com/qq/' + event.target.value
        }).then(res => {
            if (res.data.code === 200) {
                setqqUserInfo(res.data.data)
                // 自动填充邮箱
                form.current.setFieldsValue({
                    email: res.data.data.qq + '@qq.com',
                    nick: res.data.data.name
                })
                // 自动填充头像
                setqqImage(res.data.data.avatar)
            }
            else {
                message.error('qq号输入错误！请重试')
            }
        })
    }
    // 切换页码
    function changePage(page) {
        setPage(page)
    }
    /* 点击的是一级留言的回复按钮，准备发布二级留言 */
    function submitReply(item) {
        const { id } = item
        setIsReply(true)//点击了一级留言的回复按钮
        setReplyId(id)//二级留言标质量
        setFlag(0)//二级留言标质量
        setReplyInfo(item)//存储回复对象的信息
        scrollToAnchor("menuList", true)
    }
    /* 点击的是二级留言的回复按钮，准备发布三级留言 */
    function submitTwodReply(item) {
        const { id } = item
        setsThirdRepl(true)
        setReplyEndid(id)
        setFlag(1)
        setReplyInfo(item)
        scrollToAnchor("menuList", true)
        setOriginId(item.id)//对于二级留言，item.id就是这个二级留言的id，留着作为三级留言的根id的
    }
    /* 点击的是三级留言的回复按钮，准备发布三级留言 */
    function submitThirdReply(item, i) {
        const { id } = item
        setsThirdRepl(true)
        setReplyEndid(id)
        setFlag(1)
        setReplyInfo(item)
        scrollToAnchor("menuList", true)
        setOriginId(i.id)//对于三级留言，item为当前这个留言，i为所隶属的二级留言，不是回复对象！
    }
    /* 实现点击回复按钮，向上跳转到表单功能 */
    function scrollToAnchor(anchorName, smooth) {
        // scrollToAnchor为h5新增API
        if (anchorName) {
            const anchorElement = document.getElementById(anchorName);
            if (anchorElement) {
                anchorElement.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
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
                            <p>您可以选择两种方式进行留言哟：</p>
                            <p><StarOutlined className='icon' />1.直接输入<span>qq号</span> ，获得昵称、邮箱、头像</p>
                            <p><StarOutlined className='icon' />2.忽略qq,直接输入自定义的<span>昵称</span>和真实的<span>qq邮箱</span></p>
                            <p><StarOutlined className='icon' />注意：留言回复将通过<span>qq邮箱</span>提醒您哟</p>
                        </div>
                        <div className="nick">
                            {
                                // 如果头像是默认的，说明尚未留言或者留言成功，则不显示昵称
                                qqImage !== 'https://pics5.baidu.com/feed/960a304e251f95cab3693a1b1509a238660952a0.jpeg?token=5d39e841d225ed2520ab17eaf7cea79a' ?
                                    <span>***{qqUserInfo.name || JSON.parse(localStorage.getItem('username'))}***</span> :
                                    ''
                            }

                        </div>
                        <h1>欢迎留下您的小脚印哟(*^▽^*)</h1>
                        {
                            isReply || isThirdReply ?
                                <div className="replyObject">
                                    <span>回复：</span>
                                    <span className="username">{replyInfo.nick}&nbsp;&nbsp;&nbsp;{dateFormatter(replyInfo.create_time)}</span>
                                    <div className="content">
                                        <span>{replyInfo.content}</span>
                                    </div>
                                </div>
                                : ''
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
                                        <img style={{ height: 80, width: 80 }} src={qqImage} alt="" />
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
                                    <Input placeholder="请输入昵称(必填)" style={{ width: 140 }} />
                                </Form.Item>

                                <Form.Item
                                    label=" QQ:"
                                    name="QQ"
                                    onBlur={(event) => getAllQQIinfo(event)}
                                >
                                    <Input placeholder="输入qq号可直接获得昵称和邮箱！(选填)" style={{ width: 200 }} />
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
                                    <Input placeholder="请填写真实邮箱(必填)" />
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
                                            (isThirdReply || isReply) ? '回复留言' : '发表留言'
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
                                messageList.map((item, index) => {
                                    return (
                                        <div className="commentandreply" key={index}>
                                            {/* 一级留言区 */}
                                            <div className='commentOne' >
                                                <div className="left">
                                                    <div className="img">
                                                        <img src={item.avatar} alt="" style={{ width: 50, height: 50 }} />
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div className="info">
                                                        <span className='userName'>
                                                            <i>
                                                                {
                                                                    item.nick === "钟爱enfp女孩" ?
                                                                        '☆博主☆ '
                                                                        : ''
                                                                }
                                                            </i>

                                                            {item.nick}
                                                        </span>
                                                        <span>{dateFormatter(item.create_time)}</span>
                                                    </div>
                                                    <div className="content">
                                                        <span>{item.content}</span>
                                                        <Link onClick={() => submitReply(item)} >
                                                            <p>回复</p>
                                                        </Link>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="commentReply">
                                                {
                                                    item.secondReply !== [] ?
                                                        item.secondReply.map((i, j) => {
                                                            return (
                                                                i.parent_id === item.id ?
                                                                    (
                                                                        /* 二级留言区 */
                                                                        <div className="twoandthird" key={j}>
                                                                            <div className='reply' >
                                                                                <div className="left">
                                                                                    <div className="img">
                                                                                        <img src={i.avatar} alt="" style={{ width: 50, height: 50 }} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="right">
                                                                                    <div className="info">
                                                                                        <span className='userName'>
                                                                                            <i>
                                                                                                {
                                                                                                    i.nick === "钟爱enfp女孩" ?
                                                                                                        '☆博主☆ '
                                                                                                        : ''
                                                                                                }
                                                                                            </i>
                                                                                            {i.nick}
                                                                                        </span>
                                                                                        <span>{dateFormatter(i.create_time)}</span>
                                                                                    </div>
                                                                                    <div className="content">
                                                                                        <span>{i.content}</span>
                                                                                        {/* 第一个参数任意，第二个为事件对象（可不传） */}
                                                                                        <Link onClick={() => submitTwodReply(i)} >
                                                                                            <p>回复</p>
                                                                                        </Link>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* 三级留言区 */}
                                                                            <div className="thirdReply">
                                                                                {
                                                                                    item.secondReply[j].thirdReply !== [] ?
                                                                                        item.secondReply[j].thirdReply.map((one, k) => {
                                                                                            return (
                                                                                                <div className="endReply" key={k}>
                                                                                                    <div className="left">
                                                                                                        <div className="img">
                                                                                                            <img src={one.avatar} alt="" style={{ width: 50, height: 50 }} />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="right">
                                                                                                        <div className="info">
                                                                                                            <span className='userName'>
                                                                                                                <i>
                                                                                                                    {
                                                                                                                        one.nick === "钟爱enfp女孩" ?
                                                                                                                            '☆博主☆ '
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                </i>
                                                                                                                {one.nick}
                                                                                                                <span className='replyTitle'>回复</span>
                                                                                                                {
                                                                                                                    one.nick == i.nick ?
                                                                                                                        item.secondReply[j].thirdReply[0].nick
                                                                                                                        :
                                                                                                                        (
                                                                                                                            one.origin_id === i.origin_id ?
                                                                                                                                (<i>
                                                                                                                                    {
                                                                                                                                        i.nick === "钟爱enfp女孩" ?
                                                                                                                                            '☆博主☆ '
                                                                                                                                            : ''
                                                                                                                                    } <span>{i.nick}</span>
                                                                                                                                </i>
                                                                                                                                )
                                                                                                                                : getOriginIdNick(one.parent_id)//获取回复的对象是谁？
                                                                                                                        )
                                                                                                                }
                                                                                                            </span>
                                                                                                            <span>{dateFormatter(one.create_time)}</span>
                                                                                                        </div>
                                                                                                        <div className="content">
                                                                                                            <span>{one.content}</span>
                                                                                                            {/* 第一个参数任意，第二个为事件对象（可不传） */}
                                                                                                            <Link onClick={() => submitThirdReply(one, i)} >
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
                                                        : ''
                                                }
                                            </div>

                                        </div>

                                    )
                                })
                            }
                            <div className="page">
                                {/* 如果写成messageList.length会报错，因为页面刚渲染时候，是读取不到messageList，所有要尽量避开length使用，直接调用状态就行 */}
                                <Pagination onChange={changePage} total={allCommentNum.length} pageSize={10} />
                            </div>
                        </Card>
                    </div>

                    <div className="hootpart">
                        <Hottest></Hottest>
                    </div>
                    <SliderRight></SliderRight>
                </Content>
                <FooterPart></FooterPart>
            </Layout>

        </div>
        // </Suspense>
    )
}
