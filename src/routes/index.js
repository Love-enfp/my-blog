/* 
    创建路由表，方便对路由进行管理
*/
import { lazy } from 'react'
const Home = lazy(() => import('../pages/Home'))
const Sort = lazy(() => import('../pages/Sort'))
const Music = lazy(() => import('../pages/Music'))
const AboutMe = lazy(() => import('../pages/AboutMe'))
const LeaveWords = lazy(() => import('../pages/LeaveWords'))
const Articles = lazy(() => import('../pages/Articles'))
const Label = lazy(() => import('../pages/Label'))
const LabelArticles = lazy(() => import('../components/LabelArticles'))
const SortArticles = lazy(() => import('../components/SortArticles'))
const BuildLog = lazy(() => import('../pages/BuildLog'))
// 加载路由组件
// import Home from '../pages/Home'
// import Sort from '../pages/Sort'
// import Music from '../pages/Music'
// import AboutMe from '../pages/AboutMe'
// import LeaveWords from '../pages/LeaveWords'
// import Articles from '../pages/Articles'
// import Label from '../pages/Label'
// import LabelArticles from '../components/LabelArticles'
// import SortArticles from '../components/SortArticles'
// import BuildLog from '../pages/BuildLog'

const routes= [
    {
        path:'/',
        element:<Home></Home>,
    },
    {
        path:'/article/:id',
        element:<Articles/>
    },
    {
        path:'/sort',
        element:<Sort></Sort>,
        children:[
            {
                path:'SortArticles',
                element:<SortArticles></SortArticles>,
            }
        ]
    },
    {
        path:'/music',
        element:<Music></Music>
    },
    {
        path:'/leavewords',
        element:<LeaveWords></LeaveWords>
    },
    {
        path:'/aboutme',
        element:<AboutMe></AboutMe>
    }
    ,
    {
        path:'/buildlog',
        element:<BuildLog></BuildLog>
    }
    ,
    {
        path:'/label',
        element:<Label></Label>,
        children:[
            {
                path:'labelArticles',
                element:<LabelArticles></LabelArticles>,
            }
        ]
    }
]

export default routes

