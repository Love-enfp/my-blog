import React from 'react'
import './index.scss'
import {QqOutlined,HomeOutlined,WechatOutlined,WhatsAppOutlined} from '@ant-design/icons';

// 引入qq和微信照片
import QQ from '../../assets/images/qq.png'
import Wechat from '../../assets/images/wechat.png'
export default function FooterPart() {
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
        <div>本站点已经开通：29天5时55分56秒 (*๓´╰╯`๓)</div>
    </div>
  )
}
