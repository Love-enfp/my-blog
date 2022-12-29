import React from 'react'
import './index.scss'
import LabelSlider from '../LabelSlider'
import UserInfoSlider from '../UserInfoSlider'
export default function SliderRight() {
  return (
    <div className='slidertight'>
         <UserInfoSlider></UserInfoSlider>
         <LabelSlider></LabelSlider>
    </div>
  )
}
