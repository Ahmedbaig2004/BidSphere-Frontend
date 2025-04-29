import React from 'react'

const NewsLetterBox = () => {
    const onsubmithandler=(e)=>{
        e.preventDefault();
    }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800  dark:text-white dark:bg-gray-900'>Subscribe Now And Get Latest Bids Info</p>
        <p className='text-gray-400 mt-3  dark:text-white dark:bg-gray-900'>Lorem ipsum dolor sit amet consectetur ullam repudiandae voluptate quod</p>
        <form onSubmit={onsubmithandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input type="email" placeholder='enter your email'required className='sm:flex-1 w-full outline-none ' />
        <button  type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsLetterBox
