import React from 'react'
//导入路由表
import routes from './routes/index'
//导入useRoutes
import { useRoutes } from "react-router-dom";

export default function App() {
  // 根据路由表生成对应的路由规则
  const element=useRoutes(routes)
  return (
    <div>
      {/* 注册路由部分   */}
      {element}
    </div>
  )
}


