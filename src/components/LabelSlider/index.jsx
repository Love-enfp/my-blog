import React, { useState } from 'react'
import Card from 'antd/lib/card/Card'
import { useEffect } from 'react'
import './index.scss'
// import { NavLink } from 'react-router-dom'
import { EditFilled } from '@ant-design/icons'
import { getColor,getSize } from '../../utils/random'
import { Link } from 'react-router-dom'
import api from '../../api'
// import { NavLink } from 'react-router-dom'
export default function LabelSlider() {
  // keys存储键值，比如['詹姆斯'，'库里',....]
  const [keys,setKeys]=useState([])
  // keys存储对值，比如['2'，'1',....]
  const [values,setValues]=useState([])

  const [label,setLabel]=useState([])
  useEffect(()=>{
    // 获得所有的文章标签
    api.getLabels().then(res=>{
      if(res.data.status===200)
      {
        setLabel(res.data.result)
        // 获得纯标签数据arr，仅有标签名
        const arr=res.data.result.map(item=>item.name)
        let objGroup = arr.reduce(function (obj, name) {
            obj[name] = obj[name] ? ++obj[name] : 1;
            return obj;
        }, {});
        setKeys(Object.keys(objGroup))
        //objKey是对象的键名构成的数组
        // let objKey = Object.keys(objGroup);
        
        setValues(Object.values(objGroup))
        //objValue是对象的值构成的数组
        // let objValue = Object.values(objGroup);
        
        // console.log(objGroup);//{"詹姆斯": 1, "库里": 3, "湖人": 3}
        // console.log(objKey);//["1", "2", "3"]
        // console.log(objValue);//[1, 3, 3]
      }
      else{
        console.log('标签数据获得失败');
      }
    })

},[])//eslint-disable-line

      
  return (
    <div className='labelList'>
        <Card  style={{ width: 300 }} className="LabelSlider">
              <p><EditFilled className='icon'/><span>&nbsp;&nbsp;标签</span></p>
              <div>
                {
                  keys.map((item,index)=>{
                    return (
                      
                      <div className='label'   key={index}>
                        {/* <Link to="/label" key={index}><span>#{item}</span></Link> */}
                        <Link  to="/label/labelArticles" style={{color:getColor(),fontSize:getSize(),fontWeight:600}} state={{item:item,label:label}}  >
                          {item}
                        </Link>
                        {/* 暂时不需要显示数量{values[index]} */}
                      </div>
                    )
                    
                  })
                }
             </div>
             
        </Card>
    </div>
  )
}
