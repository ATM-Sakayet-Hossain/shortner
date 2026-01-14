import React from 'react'
import UrlShortner from '../components/ui/UrlShortner'
import Steps from '../components/ui/Steps'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UrlShortner />
      <Steps />
    </div>
  )
}

export default Home