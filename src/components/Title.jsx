import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-5 '>
        <p className='text-gray-500 dark:text-white dark:bg-gray-900'>{text1} <span className='text-gray-700 font-medium dark:text-white dark:bg-gray-900'>{text2}</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700 dark:bg-gray-100'></p>
      
    </div>
  )
}

export default Title
