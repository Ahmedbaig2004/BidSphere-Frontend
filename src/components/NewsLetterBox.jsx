import React from 'react'

const NewsLetterBox = () => {
    const onsubmithandler=(e)=>{
        e.preventDefault();
    }
  return (
    <div className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 sm:p-12 my-16'>
      <div className='text-center max-w-3xl mx-auto'>
        <h2 className='text-2xl sm:text-3xl font-medium text-white mb-4'>Subscribe Now And Get Latest Bids Info</h2>
        <p className='text-white/70 text-sm sm:text-base mb-8'>Stay updated with the latest bidding opportunities and never miss out on your favorite items.</p>
        <form onSubmit={onsubmithandler} className='w-full sm:w-3/4 flex flex-col sm:flex-row items-center gap-4 mx-auto'>
          <input 
            type="email" 
            placeholder='Enter your email' 
            required 
            className='w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors duration-300' 
          />
          <button 
            type='submit' 
            className='w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20'
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsLetterBox
