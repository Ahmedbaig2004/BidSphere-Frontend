import React from 'react'
import Hero from '../components/Hero'
import LatestAuctions from '../components/LatestAuctions'
import PopularAuctions from '../components/PopularAuctions'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestAuctions/>
      <PopularAuctions/>
      <OurPolicy/>
      <NewsLetterBox/>

    </div>
  )
}

export default Home
