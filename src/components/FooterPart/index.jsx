import React from 'react'
import './index.scss'
import {QqOutlined,HomeOutlined,WechatOutlined,WhatsAppOutlined} from '@ant-design/icons';

// 引入qq和微信照片
import QQ from '../../assets/images/qq.png'
import Wechat from '../../assets/images/wechat.png'
export default function FooterPart() {
    // 计算开通博客已经多久
    function handlerDateDurationCurrent (time) {
        let d1 = new Date(time)
        let d2 = new Date()
        let cha = Math.abs(d2.getTime() - d1.getTime())
        let days = parseInt(cha / (24 * 60 * 60 * 1000))
        let hours = parseInt(cha % (24 * 60 * 60 * 1000) / (60 * 60 * 1000))
        let mins =  parseInt(cha % (60 * 60 * 1000) / (60 * 1000))
        let secs =  parseInt(cha % (60 *  1000) / ( 1000))
        if (days) {
          return ` ${days}天 ${hours}时 ${mins}分 ${secs}秒`
        } else if (hours) {
          return `+ ${hours}时 ${mins}分`
        } else {
          return `+ ${mins}分`
        }
      }
      let preDate = '2022-12-09 17:34:54'
      let result = handlerDateDurationCurrent(preDate)
    //   console.log(result) // 30d 20h 3m

  return (
    <div className="footer">
        <ul>
            <li className='first'>
                <h3><WhatsAppOutlined />联系我</h3>
                <h2>qq:1553857505</h2>
                <h2>phone:18625772195</h2>
                <h2>E-mail:1553857505qq.com</h2>
                
            </li>
            <li>
                <h3><QqOutlined />qq群聊</h3>
                <img src={QQ} alt="" />
            </li>
            <li>
                <h3><WechatOutlined />关注公众号</h3>
                <img src={Wechat} alt="" />
            </li>
            <li className='message'>
                <h3><HomeOutlined /> 小房子信息</h3>
                <h2>文章总数：1</h2>
                <h2>访问总数：1</h2>
                <h2>评论总数：1</h2>
                <h2>留言总数：1</h2>
            </li>
        </ul>
        <p>赣ICP备20004408号-1</p>
        <div>本站点已经开通：{result} (*๓´╰╯`๓)</div>
    </div>
  )
}
