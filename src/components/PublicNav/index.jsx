import React from 'react'
// 先引入antd样式
import 'antd/dist/antd.min.css'
// 再导入全局样式，防止覆盖
import { Menu ,Drawer,Button,Space} from 'antd'
import './index.scss'
import { useState } from 'react'
import {AppstoreOutlined,HomeOutlined,EditFilled, EditOutlined,PlayCircleOutlined,EyeOutlined,UnorderedListOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import SliderRight2 from '../../components/SliderRight2'
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

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const showDefaultDrawer = () => {
    setSize('small');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className='nav'>
        
      
      <div className="mask">
      <Space>
        <span onClick={showDefaultDrawer}><UnorderedListOutlined></UnorderedListOutlined> </span>
      </Space>
      <Drawer
        title={`${size} Drawer`}
        placement="left"
        size={size}
        onClose={onClose}
        open={open}
        mask
      >
        <div className="maskSlider">
          <SliderRight2></SliderRight2>

        </div>
      </Drawer>
     
      </div>
      
      {/* defaultOpenKeys={['/home']} defaultSelectedKeys={[pathname]}都是通过上面的key值进行匹配 */}
      
       <Menu  mode="horizontal" items={items}  onClick={onClick} defaultOpenKeys={['/']} defaultSelectedKeys={[pathname]}/>;
    </div>
  )
}
