import { Avatar, List ,Card} from 'antd';
import './index.scss'
import {dateFormatter} from '../../utils/dateFormat'
import {FireFilled,EditFilled, BarChartOutlined,MoneyCollectFilled,EyeOutlined,LikeOutlined,CarryOutOutlined,DislikeOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import React from 'react'
import {NavLink} from 'react-router-dom'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../api'
export default function Hottest(props) {
  

  const [articleView,setArticleView]=useState([])

  useEffect(()=>{

    api.getArticlesView({page:1}).then(res=>{
      if(res.data.status===200)
      {

         // 存储浏览量由高到低的文章
        setArticleView(res.data.allNumByView)

        props.getArticleSwipper(res.data.allNumByView)
        // // 将分过页码的数据存储到state中
        // setArticles(res.data.result)
      }
    })
  },[])

  return (
    <div className="hottst">
      <div className="card">

      
      <div className="top">
      <h3><BarChartOutlined /><span> 文章热度排行</span></h3>
      
      </div>
      <div className="hotIcon">
        <FireFilled className='first'/>
        <FireFilled className='second' />
        <FireFilled  className='third'/>
      </div>
      {
        articleView?
        articleView.map((item,index)=>{
          return (
              <div className='ant-list-item' key={index}>
                <div className="left">
                  <div className="artImg">
                    <img src={item.img} alt="" />
                  </div>
                </div>
                <div className="right">
                  <div className="title">
                    <div className="title">
                      <NavLink  to={`/article/${item.id}`}>
                         <p>{item.title}</p>
                      </NavLink>
                      
                    </div>
                  </div>
                  <div className="info">
                    <p className="hot">{item.view}人阅读</p>
                    <p className="time">{dateFormatter(item.create_date,'yyyy-mm-dd HH:mm:ss')}</p>
                  </div>
                
                </div>
              </div>
          )
        })
        :''
      }
      </div>
    
  </div>
  )
}
