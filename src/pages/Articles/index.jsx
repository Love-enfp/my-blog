import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
// 1. 引入markdown-it库
// import markdownIt from 'markdown-it'
// 用插件来渲染成markdown格式的内容
import {marked} from 'marked';
// 代码高亮
import hljs from 'highlight.js';
import './github-dark.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { Card, Layout ,Modal ,Popover } from 'antd'
// 引入头像
import userImage from '../../assets/images/user.png'
import PublicNav from '../../components/PublicNav'
import {AlertOutlined,EditFilled, AppstoreOutlined,MoneyCollectFilled,EyeOutlined,LikeOutlined,CarryOutOutlined,DislikeOutlined} from '@ant-design/icons';
import Comment from '../../components/Comment'
// 引入格式化时间
import {dateFormatter} from '../../utils/dateFormat'
import { giveLike } from '../../redux/actions/articles'
import SliderRight from '../../components/SliderRight'
import FooterPart from '../../components/FooterPart'
import WeChat from '../../assets/images/wechattip.png'
import ZhiFuBao from '../../assets/images/zhifubao.png'
import { useLocation } from 'react-router-dom'
import api from '../../api'
import { useRef } from 'react'

const { Header, Footer, Content } = Layout;

export default function Articles() {
   
  const commentRef=useRef()
  // 2. 生成实例对象
  // const md = new markdownIt()

  const dispatch=useDispatch()

  const [res,setRes]=useState([])

  // 存储所有标签
  const [label,setLabel]=useState([])
  // 存储所有分类
  const [sort,setSort]=useState([])
  
  // 从redux中取出所有的文章数据
  const articles=useSelector(state=>state.articles)

  const [currentView,setCurrentView]=useState(0)

  /* 下面通过state方式传递，回报找不到id的错误！不知道为啥？ */
  // useLocation拿到传递过来的参数,没有用useParams（出现在地址栏）
  // const { state } = useLocation()

  // const id=state.id

  const {id}=useParams()
  // console.log(id);  
  useEffect(()=>{
        window.scrollTo(0, 0);
          // 获得当前id页面的文章数据
         let obj= articles.filter((item)=>{
            return (id*1)===item.id//注意这里item.id是整型数值！！
          })
          setRes(obj)
          // 获得所有的文章标签数据
          api.getLabels().then(res=>{
            setLabel(res.data.result)
          })
          // 获得所有的文章分类数据
          api.getSorts().then(res=>{
            setSort(res.data.result)
          })
          // 获得当前的浏览量
          api.getCurrentView({id:id}).then(res=>{
            if(res.data.status===200)
            {
                setCurrentView(res.data.result[0].view)
            }
            
        })

        // 配置highlight
        hljs.configure({
          tabReplace: '',
          classPrefix: 'hljs-',
          languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
        });
        // 配置marked
        marked.setOptions({
          renderer: new marked.Renderer(),// 这是必填项
          highlight: code => hljs.highlightAuto(code).value,// 高亮的语法规范
          gfm: true, //默认为true。 允许 Git Hub标准的markdown.
          tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
          breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
        });
  },[])//eslint-disable-line

  // 控制是否打开点赞后的提示框
  // const [isModalOpen, setIsModalOpen] = useState(true);
  /* 实现文章点赞功能 */
  function handleLike(){
    // res[0].like+=1  不能通过这样方式更改，并不会影响到redux中的存储
    dispatch(giveLike(id*1))//需要传递整型数值
    // 提示效果
    Modal.success({
      content: '感谢您的点赞，Up主将继续努力分享更棒的文章！',
    });
  }
  


  const content = (
    <div>
      <img src={WeChat} style={{width:200, height:180}} alt="" />
      <img src={ZhiFuBao} style={{width:200, height:180}} alt="" />
    </div>
  );

  return (
    <div className='articlePage'>
      <Layout>
        {/* 头部 */}
        <Header>
          <PublicNav></PublicNav>
          
        </Header>
        <Content>
          <SliderRight></SliderRight>
          <Card>
            {
                res.map((item,index)=>{
                  return (
                    <div key={index} className="allContent">
                        <h1>{item.title}</h1>
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
                                    <div className="like">
                                    <LikeOutlined />
                                        <span>{item.like}</span>
                                    </div>
                                    <div className="dislike">
                                      <DislikeOutlined />
                                        <span>{item.dislike}</span>
                                    </div>
                                    <div className="views">
                                       <EyeOutlined /><span>{currentView}</span>
                                    </div>
                                    <div className="open">
                                      <AlertOutlined /><span>公开</span>
                                    </div>
    
                          </div>
                          {/* 正文内容部分 */}
                         <p
                          className='content'
                          dangerouslySetInnerHTML={{
                            __html: marked(item.content).replace(/<pre>/g, "<pre id='hljs'>"),
                          }}
                          // dangerouslySetInnerHTML={{__html:md.render(item.content)}}
                          >

                          {}
                         </p>
                         <div className="admire">
                            <div className="like" onClick={handleLike}>
                              <Link >
                                <LikeOutlined></LikeOutlined>
                             </Link>
                            </div>
                            <Popover title="予人玫瑰，手有余香，不胜感激" content={content} placement="right" trigger="click">
                              <div className="tip" >
                              <Link>
                                <MoneyCollectFilled />
                              </Link>
  
             
                            </div>
                            </Popover>
                        </div>
                    </div>
                  )
                  
                })
            }
            <div className="moreInfo">
              <div className="sort">
                  <AppstoreOutlined />分类：
                  {
                  sort.map((item,index)=>
                    item.blog_id===(id*1)?
                     (
                      // <link to="/sort" key={index}>
                        
                        <Link to="/sort" key={index}><span>#{item.name}</span></Link>
                      // </link>
                      // <a href="www.baidu.com" key={index}>
                          
                      //  </a>
                    ):
                    ''
                  )
                }
                 
                  
              </div>
              <div className="label">
                   <EditFilled></EditFilled>标签：
                   <span></span>
                {
                  label.map((item,index)=>
                    item.blog_id===(id*1)?
                     (
                      <Link to="/label" key={index}><span>#{item.name}</span></Link>
                    ):
                    ''
                  )
                }
                   
                   
                  
                  
              </div>
            </div>
          </Card>
          <div className="comment">
            <Comment data={id}></Comment>
          </div>
        </Content>
        <FooterPart></FooterPart>
      </Layout>
       
       
    </div>
  )
}
