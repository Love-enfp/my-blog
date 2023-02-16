import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './index.scss'
import ArticleFormat from '../ArticleFormat'
export default function LabelArticles() {
    //1------.获得存储在redux中的文章数据
    const articles = useSelector(state => state.articles)

    // useLocation拿到传递过来的参数
    const { state } = useLocation()
    const { item, label } = state
    // item为：詹姆斯或者欧文或者湖人。。。。。,label为{id: 1, blog_id: 1, name: '欧文'}
    // console.log(label)
    // 2.------获得标签詹姆斯对应的标签数据
    const res = label.filter((i) => i.name === item)


    // 3.--------获得上面标签数据中的id数组，也就是标签所对应的文章id
    const ids = []
    res.map(item => {
        return ids.push(item.blog_id)
    })

    // 4.---------遍历文章数组，若发现当前文章的id是属于ids数组的，说明此文章是标签对应的文章
    const all = articles.filter(item => {
        return ids.indexOf(item.id) !== -1 ? item : ''
    })


    return (
        <div className="labelArticle">
            <ArticleFormat articlesData={all}></ArticleFormat>

        </div>
    )
}
