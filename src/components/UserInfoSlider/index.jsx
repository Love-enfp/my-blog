import React from 'react'
import './index.scss'
import userImage from '../../assets/images/user.png'
import Card from 'antd/lib/card/Card'
import { NavLink } from 'react-router-dom'
import { Divider,Descriptions } from 'antd'
// 先引入antd样式
import 'antd/dist/antd.min.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HeartOutlined ,AntCloudOutlined,SketchOutlined,GlobalOutlined} from '@ant-design/icons';
import axios from 'axios'
import api from '../../api'
export default function UserInfoSlider() {
    const article=useSelector(state=>state.articles)
    const [sort,setSort]=useState([])
    const [label,setLabel]=useState([])
    const [ipInfo,setIpInfoList]=useState({})
    const [weather,setWeather]=useState({})
    const [loveword,setLoveword]=useState('')
    const [history,setHistory]=useState([])
  useEffect(()=>{
    
    api.getSorts().then(res=>{
        setSort(res.data.result)
      })
      api.getLabels().then(res=>{
        setLabel(res.data.result)
      })

      getinfo()

      async  function getinfo(){

        let city
        // // 1.获得ip方法1(上线的ip总是显示深圳???why)
        // await  axios('/api9/?token=ff5e4c65bf03c9').then(res=>{
        // city= res.data.city
        // console.log("***",res.data);
        // setIpInfoList(res.data)
        // })

         // 1.获得ip方法2
         await  axios('/api13/api/ip/self?app_id=voplliljirrpnynl&app_secret=UUtNWDJuVWt6amtGdGlNL1JqQmVEdz09').then(res=>{
            city= res.data.data.city
            // console.log("%%%%%%%%",res.data.data);
            setIpInfoList(res.data.data)
        })

        // 2.获得天气情况（本地）
        axios(`/api11/weather03/api/weatherService/getDailyWeather?cityName=${city}`).then(res=>{
        // console.log("---",res.data.results[0]);
        setWeather(res.data.results[0])
        })
       
         // 3.获得土味情话
         axios(`/api16/api/rand.qinghua?format=json`).then(res=>{
            setLoveword(res.data.content)
        })
         // 4.获得历史上的今天
         axios(`/api17/lishi/api.php`).then(res=>{
            let n=res.data.result.length
            setHistory(res.data.result[n-1])
        })

      }
      
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
            <Divider />
            <div className="visitorinfo">
                <div className="title">相见恨晚❤</div>  
                <div className="info">
                    <div>您的ip:<span> {ipInfo.ip}</span></div>    
                    <div>省份:<span> {ipInfo.province}</span></div>    
                    <div>城市:<span> {ipInfo.city}</span></div>    
                    <div>ISP:<span> {ipInfo.isp}</span></div>    
                </div> 
                <div className="weather">
                     <div className="title">天气情况<span> <AntCloudOutlined /></span></div>  
                    {
                             weather.daily?
                            weather.daily.map((item,index)=>{
                            return (
                                 <div className='weatheritem' key={index}>
                                    <div className='date'></div>
                                        <div className='temp'>
                                            {item.date}
                                            <span className='degree'> {item.low}~{item.high}℃ </span>
                                            <span className='status'>{item.text_day==item.text_night?item.text_day: item.text_day+'转'+item.text_night}</span>
                                            <span className='wind' > {item.wind_direction}风</span>
                                    </div>
                                </div>

                                 )
                            })
                                :''
                                }  
                </div> 

            </div>
            <div className="loveword">
                <div className="title">每日一句情话<span> <SketchOutlined /></span></div>  
                <p>{loveword}</p>
            </div>
            <div className="history">
                 <div className="title">历史上的今天<span><GlobalOutlined /></span></div>  
                <p>{history.date}</p>
                <p>{history.title}</p>
            </div>
           
        </Card>
    </div>
  )
}
