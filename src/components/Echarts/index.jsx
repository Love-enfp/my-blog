import React from 'react'
import { useEffect } from 'react';
import * as echarts from 'echarts';
import { useRef } from 'react';
import './index.scss'
export default function Echarts(props) {

  const echartDom = useRef(null)
  useEffect(() => {
    // 获得echartDom元素
    const { keys, values } = props.data.current
    // 初始化图标数据-------------------这里解决异步问题！
    initData(echartDom.current, keys, values)
  }, [])//eslint-disable-line
  // 初始化图标数据
  function initData(node, keys, values) {
    // 2.初始化图标（参数为DOM）
    var myChart = echarts.init(node);
    let seriesData = []
    seriesData = switchEchartsData(keys, values)
    const option = {
      title: {//标题样式
        text: '标签分布图',
        left: 'left',
        padding: [20, 20],
        textStyle: {
          color: 'black',
          fontWeight: 300,
          fontSize: 22
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
          data: seriesData,
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
    // 3.谁知配置项
    myChart.setOption(option);

  }

  function switchEchartsData(keys, values) {
    // console.log(keys,values);
    let res = []
    res = keys.map((item, index) => {
      return (
        {
          name: item,
          value: values[index]
        }
      )
    })
    // console.log(res);
    return res
  }
  // 1.基于准备好的dom，初始化echarts实例
  return (
    <div className='echarts' style={{ height: 450, width: 500 }} ref={echartDom}>
    </div>
  )
}
