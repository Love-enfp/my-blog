import React from 'react'
import PublicNav from '../../components/PublicNav'
import { Layout } from 'antd';
import FooterPart from '../../components/FooterPart';
import './index.scss'
const { Header,  Content } = Layout;
export default function Music() {

  return (
    <div className='music'>
      <Layout>
        <Header>
          <PublicNav></PublicNav>
        </Header>
        <Content>
          <iframe  title="navigation" style={{ width:750, height:550 ,frameborder:"no", border:"0" ,marginwidth:"0" ,marginheight:"0"}} src="//music.163.com/outchain/player?type=0&id=2968527373&auto=1&height=430">
          </iframe>
        </Content>
        <FooterPart></FooterPart>
      </Layout>
        
    </div>
  )
}
