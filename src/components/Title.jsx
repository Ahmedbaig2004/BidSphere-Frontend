import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

const Title = ({text1,text2}) => {
  const { isLightTheme } = useContext(ThemeContext);
  
  return (
    <div className='inline-flex gap-2 items-center mb-5'>
        <p className={`${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
          {text1} <span className={`font-medium ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{text2}</span>
        </p>
        <p className={`w-8 sm:w-12 h-[1px] sm:h-[2px] ${isLightTheme ? 'bg-gray-800' : 'bg-white'}`}></p>
    </div>
  )
}

export default Title
