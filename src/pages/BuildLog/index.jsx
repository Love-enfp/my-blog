import React from 'react'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {StarOutlined} from '@ant-design/icons';
import PublicNav from '../../components/PublicNav';
import api from '../../api';
import './index.scss'
import { useEffect } from 'react';
import {dateFormatter2} from '../../utils/dateFormat.js'
import { useState } from 'react';
import FooterPart from '../../components/FooterPart';
export default function BuildLog() {
  
  const [blogList,setBlogList]=useState([])

  useEffect(()=>{
    api.getBuildLog().then(res=>{
      //  console.log(res);
       setBlogList(res.data.result)
    })
  },[])
  return (
    <div className='buildlog'>
      <PublicNav></PublicNav>
      <VerticalTimeline>
        {
          blogList.map((item,index)=>{
            return (
                    <VerticalTimelineElement
                      key={index}
                      className="vertical-timeline-element--work"
                      contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                      contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                      date={dateFormatter2(item.create_date) }
                      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                      icon={<StarOutlined /> }
                    >
                      <p>
                        {item.content}
                      </p>
                    </VerticalTimelineElement>
            )
          })
        }
        
     
        <VerticalTimelineElement
                      className="vertical-timeline-element--work"
                      contentStyle={{ background: 'rgb(33, 150, 243)', color: 'orange' }}
                      contentArrowStyle={{ borderRight: '7px solid  blue' }}
                      iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                      // icon={<StarOutlined /> }
                    >
                       <p style={{fontWeight:500,fontSize:20}}>到头了，亲~</p>
                    </VerticalTimelineElement>
        <VerticalTimelineElement
          
          // icon={<CheckCircleOutlined /> }
        />
        
      </VerticalTimeline>
        <FooterPart></FooterPart>
    </div>
  )
}
