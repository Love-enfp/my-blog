import React from 'react'
// 先引入antd样式
import 'antd/dist/antd.min.css'
// 再导入全局样式，防止覆盖
import { Menu } from 'antd'
import './index.scss'
import {AppstoreOutlined,HomeOutlined,EditFilled, EditOutlined,PlayCircleOutlined,EyeOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
export default function PublicNav() {
  const {pathname}=useLocation()
  // 菜单项
  const items = [
    {
      label: '首页',
      key: '/',
      icon: <HomeOutlined />,
    },
    {
      label: '标签',
      key: '/label',
      icon: <EditFilled/>,
    },
    {
      label: '分类',
      key: '/sort',
      icon: <AppstoreOutlined />,
      // disabled: true,
    },
    {
      label: '音乐',
      key: '/music',
      icon: <PlayCircleOutlined />
    },
    {
      label: '留言',
      key: '/leavewords',
      icon: <EditOutlined />
    },
    {
      label: '关于我',
      key: '/aboutme',
      icon: <EyeOutlined />
    }
  ] 
  const navigate=useNavigate()
  function onClick(value){
    // console.log(value.key);
      const {key}=value
      if(key==='/'){
        navigate('/')
      }
      else if(key==='/label')
      {
        navigate('/label')
      }
      else if(key==='/sort')
      {
        navigate('/sort')
      }
      else if(key==='/music'){
        navigate('/music')
      }
      else if(key==='/leavewords'){
        navigate('/leavewords')
      }
      else if(key==='/aboutme'){
        navigate('/aboutme')
      }

  }
  return (
    <div className='nav'>
      {/* defaultOpenKeys={['/home']} defaultSelectedKeys={[pathname]}都是通过上面的key值进行匹配 */}
       <Menu  mode="horizontal" items={items}  onClick={onClick} defaultOpenKeys={['/']} defaultSelectedKeys={[pathname]}/>;
    </div>
  )
}
