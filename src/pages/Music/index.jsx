import React from 'react'
import { Layout } from 'antd';
import PublicNav from '../../components/PublicNav'
import FooterPart from '../../components/FooterPart';
import './index.scss'
import { lazy, Suspense } from 'react'
// const FooterPart = lazy(() => import('../../components/FooterPart'))
// const PublicNav = lazy(() => import('../../components/PublicNav'))
const { Header,  Content } = Layout;
export default function Music() {

  return (
    // <Suspense fallback={<div>Loading...</div>}>
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
    // </Suspense>
  )
}
