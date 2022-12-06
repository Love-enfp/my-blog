import React from 'react'
import './index.scss'
import userImage from '../../assets/images/user.png'
import Card from 'antd/lib/card/Card'
import { NavLink } from 'react-router-dom'
// 先引入antd样式
import 'antd/dist/antd.min.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api'
export default function UserInfoSlider() {
    const article=useSelector(state=>state.articles)
    const [sort,setSort]=useState([])
    const [label,setLabel]=useState([])
  useEffect(()=>{
    
    api.getSorts().then(res=>{
        setSort(res.data.result)
      })
      api.getLabels().then(res=>{
        setLabel(res.data.result)
      })
  },[])
  
  return (
    <div className='userInfoSlider'>
        <Card  style={{ width: 300 }} className="userSlider">
            <div className="userImage">
                <img src={userImage} alt="" />
            </div>
            <div className="info">
                <p className='username'>王建功</p>
                <p className='quote'>"你不努力，谁也给不了你想要的生活！"</p>
                <div className="dataDetail">
                        <div className="articleNum">
                            <p>文章</p>
                            <p className="num">{article.length}</p>
                        </div>
                        <div className="articleNum">
                            <p>标签</p>
                            <p className="num">{label.length}</p>
                        </div>
                        <div className="articleNum">
                            <p>分类</p>
                            <p className="num">{sort.length}</p>
                        </div>
                </div>
                
            </div>
            <div className="more" size="large">
                {/* 直接跳转，不要写成./或者不写 */}
                <NavLink 
                to="/aboutme" 
                className={({ isActive }) => {
                    return isActive ? 'myActive' :'myActive'
                }}
                >
                    了解更多
                </NavLink>
            </div>
           
            
        </Card>
    </div>
  )
}
