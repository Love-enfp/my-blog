import './index.scss'
import React from 'react'
import { Layout,Card } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
import PublicNav from '../../components/PublicNav';
import api from '../../api'
import { EditFilled } from '@ant-design/icons';
import {getColor} from '../../utils/random'
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import FooterPart from '../../components/FooterPart';
import SliderRight2 from '../../components/SliderRight2';
import * as echarts from 'echarts';
import { useRef } from 'react';
const { Header,  Content } = Layout;
export default function Label() {
  const echartDom=useRef(null)
    // 存储获得的标签状态，最初的发送请求返回的状态
    const [label,setLabel]=useState([])
    // keys存储键值，比如['詹姆斯'，'库里',....]
    const [keys,setKeys]=useState([])
    // keys存储对值，比如['2'，'1',....]
    const [values,setValues]=useState([])


    useEffect(()=>{
      window.scrollTo(0, 0);
      // 获得所有的文章标签
      api.getLabels().then(res=>{
        if(res.data.status===200)
        {
          // 更新状态
          setLabel(res.data.result)
           // 获得纯标签数据arr，仅有标签名
          const arr=res.data.result.map(item=>item.name)
          let objGroup = arr.reduce(function (obj, name) {
              obj[name] = obj[name] ? ++obj[name] : 1;
              return obj;
          }, {});
          setKeys(Object.keys(objGroup))
          
          //objKey是对象的键名构成的数组
          // let objKey = Object.keys(objGroup);
          setValues(Object.values(objGroup))
          //objValue是对象的值构成的数组
          // let objValue = Object.values(objGroup);
          
          // console.log(objGroup);//{"詹姆斯": 1, "库里": 3, "湖人": 3}
          // console.log(objKey);//["詹姆斯", "库里", "湖人"]
          // console.log(objValue);//[1, 3, 3]
          InitData(echartDom.current,Object.keys(objGroup),Object.values(objGroup))
        }
        else{
          console.log('标签数据获得失败');
        }
      })
      
  },[])//eslint-disable-line
  function InitData(echartDom,keys,values){
    var myChart = echarts.init(echartDom);
    let seriesData = []
    seriesData=switchEchartsData(keys,values)
    const option = {
      title: {//标题样式
        text: '标签分布图',
        left: 'left',
        padding: [10, 0],
        textStyle:{
          color :'black',
          fontWeight :300,
          fontSize:22
        }
      },
      tooltip: {//提示框组件。每个饼部分的提示
        trigger: 'item',//触发类型
        formatter: '{a} ：{b} <br/>数量: {c} ({d}%)'//提示框浮层内容格式器
      },
      legend: {//指的是饼图右边的菜单栏
        type: 'scroll',//可滚动翻页的图例
        orient: 'vertical',
        right: 0,//图例组件离容器右侧的距离。
        top: 20,
        bottom: 20,
        // data: legendData
      },
      series: [
        {
          name: '标签',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data:seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    // 绘制图表
    myChart.setOption(option);
  }
  function switchEchartsData(keys,values){
    // console.log(keys,values);
    let res=[]
    res= keys.map((item,index)=>{
      return (
        { 
          name:item,
          value:values[index]
        }
      )
    })
    return res
  }
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
  return (
    <div className='allLabels'>
      <Layout>
        {/* 头部 */}
        <Header>
        <PublicNav></PublicNav>
        </Header>
        {/* 内容区域 */}
        <Content>
            {/* 展示标签区域 */}
            
            <Card className='showLabel'>
              <p><EditFilled/><span>&nbsp;&nbsp;标签</span></p>
              <div className='echarts' style={{height:450,width:500}} ref={echartDom}>
             </div>
              
              <div className='labelsList'>
                {
                  keys.map((item,index)=>{
                    return (
                      <div className='label'    key={index} >
                          {/* 向路由组件传递state参数，可以传递更为复杂的数据！ */}
                          {/* 二级路由，路径不能加'/'，否则相当于重新去搜索这个页面，会跳转 */}
                          {/* 可用to=‘news’，to=‘./news’，to=‘/home/news’  */}
                          <Link  to="labelArticles" style={{color:getColor()}}  state={{item:item,label:label}}  onClick={()=>scrollToAnchor("components-anchor-demo-basic", true)} >
                                {item}
                                <span className='num'>
                                  {values[index]}
                                 </span>
                          </Link>
                      </div>
                    )
                  })
                }
             </div>
            </Card>

            {/* 指定路由组件（标签对应的文章）--呈现的位置 */}
            <Card className='showArticles'  id="components-anchor-demo-basic">
                  <Outlet></Outlet>
            </Card>
            <div className="rightMenu">
              <SliderRight2></SliderRight2>
            </div>
        </Content>
        <FooterPart></FooterPart>
      </Layout>
    </div>
  )
}
