import React from 'react'
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import './index.scss'
export default function TimeLine() {
  return (
    <div>
       <Timeline mode="alternate">
        <p>时光轴</p>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
        Sed ut perspiciatis unde omnis iste
        </Timeline.Item>
        <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
        Technical testing 2015-09-01
        </Timeline.Item>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
        Sed ut perspiciatis unde omnis iste 
        </Timeline.Item>
        <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
        Technical testing 2015-09-01
        </Timeline.Item>
    </Timeline>
    </div>
  )
}
