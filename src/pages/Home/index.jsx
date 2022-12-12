import React from 'react'
// 向redux中传递数据
import { useDispatch,useSelector} from 'react-redux';
import {initCity} from '../../redux/actions/articles'
import { NavLink } from 'react-router-dom';
// 先引入antd样式
import 'antd/dist/antd.min.css'
// 再导入全局样式，防止覆盖
import './index.scss'
// 引入icon图形
import {ArrowDownOutlined ,ArrowUpOutlined,LikeOutlined} from '@ant-design/icons';
import { Layout,Card ,Image,BackTop,Pagination} from 'antd'
import api from '../../api';
// 引入轮播图
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Article1 from '../../assets/images/article1.png'
import Article2 from '../../assets/images/article2.png'
import Article3 from '../../assets/images/article3.png'
import Article4 from '../../assets/images/article4.jpg'
import Article5 from '../../assets/images/article5.jpg'
import Article6 from '../../assets/images/article6.jpg'
// 引入头像
import userImage from '../../assets/images/user.png'

import { useEffect } from 'react';
import { useState } from 'react';
// 引入时间轴
// import TimeLine from '../../components/TimeLine';
// 引入公共导航
import PublicNav from '../../components/PublicNav';
// 引入右侧边栏的组件
import SliderRight from '../../components/SliderRight';
import Hottest from '../../components/Hottest';
// 引入文章展示的模板
import ArticleFormat from '../../components/ArticleFormat';
import FooterPart from '../../components/FooterPart';
const { Header, Content } = Layout;
export default function Home() {

  const [articleSwipper,setArticleSwipper]=useState([])
  
  const allReduxArticles=useSelector(state=>state.articles)
  // 创建dispatch
  const dispatch=useDispatch()
  // 创建状态存储分过页码的文章列表
  const [articleTime,setArticleTime]=useState([])
  // 存储分过页码浏览量由高到低的文章
  const [articleView,setArticleView]=useState([])
  // 存储页码
  const [page,setPage]=useState(1)


  useEffect(()=>{
    window.scrollTo(0, 0);
      api.getArticles({page}).then(res=>{
        if(res.data.status===200)
        {
          // 将所有的文章存到reudx中
          dispatch(initCity(res.data.allArticles))
          // 将分过页码的数据存储到state中
          setArticleTime(res.data.result)
          // console.log(articles);
        }
      })
      api.getArticlesView({page}).then(res=>{
        if(res.data.status===200)
        {

           // 存储浏览量由高到低的文章
          setArticleView(res.data.allNumByView)
          
          // // 将分过页码的数据存储到state中
          // setArticles(res.data.result)
        }
      })
      
  },[page])//eslint-disable-line

  function changePage(page){
     setPage(page)
  }
  // 轮播图设置
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, 
    speed: 2500,
    autoplaySpeed: 2500,
    // cssEase: "linear"
  };
  // 返回顶部设置
  const style = {
    height: 70,
    width: 30,
    lineHeight: '40px',
    borderRadius: 20,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  };
  /* 实现向下跳转功能 */
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
  // 轮播图数据
  function getArticleSwipper(data){
    setArticleSwipper(data)
  }

  return (
    <div className='home'>
      <Layout>

        {/* 头部区域 */}
        <Header>
              <PublicNav></PublicNav>
              <div className="userImage">
                <Image
                   className='userImage'
                  src={userImage}
                />
              </div>
              <div className="title">
                  没有伞的孩子，必须努力奔跑！
              </div>
              <div className="guide"  onClick={()=>scrollToAnchor("components-anchor-demo-basic", true)}>

                      <ArrowDownOutlined className="icon"/>
                      <ArrowDownOutlined className="icon"/>
                      <ArrowDownOutlined className="icon"/>
                  
              </div>
        </Header>

        <div className="mainContent">
          {/* 内容区域 */}  
          <Content id="components-anchor-demo-basic">
              <Card className='articleRecommend'  style={{ width: 1200 }}>
                <div className="recommendNew">
                    <span className='icon'><LikeOutlined /></span>
                    <span className='text'>最新说说</span>
                </div>
                <div className="swipper">
                      <Slider {...settings}>
                        {
                          articleSwipper.map((item,index)=>{
                            return (
                              <div key={index}>
                                
                                    <div className="img">
                                        <img src={item.img} alt="" />
                                        <NavLink to={`/article/${item.id}`}> <span className="text">{item.title}</span></NavLink>
                                    </div>

                                 
                                
                            </div>
                            )
                          })
                        }
                            
                            
                           
                      </Slider>
                </div>
                
              </Card>

              <Card  className='articleNew' style={{ width: 800 }}>
                  {/* <div className="title">
                        <span className='icon'><LikeOutlined /></span>
                        <span className='text'>最新文章</span>
                  </div> */}
                  
                  <ArticleFormat articlesData={articleTime} articleView={articleView}></ArticleFormat>    
                  <Pagination onChange={changePage}  total={allReduxArticles.length}  pageSize={5}/>
              </Card>

                <SliderRight></SliderRight>
                 <Hottest articleView={articleView} getArticleSwipper={getArticleSwipper}></Hottest> 
              <div className="timeLine">
                {/* <TimeLine></TimeLine> */}
              </div>
          </Content>

          {/* 底部区域 */}
          <FooterPart></FooterPart>
              
        
          {/* 回到顶部按钮 */}
            <BackTop>
              <div style={style}><ArrowUpOutlined />UP</div>
            </BackTop>
        </div>

     </Layout>
    </div>
  )
}
