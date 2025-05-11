import React from 'react'
import Hero from '../components/Hero'
import LatestAuctions from '../components/LatestAuctions'
import PopularAuctions from '../components/PopularAuctions'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestAuctions/>
      <PopularAuctions/>
      <OurPolicy/>
      

    </div>
  )
}

export default Home
