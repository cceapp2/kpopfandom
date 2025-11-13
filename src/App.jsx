import React from 'react'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import FeaturesSection from './components/FeaturesSection'
import DifferentiatorSection from './components/DifferentiatorSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <DifferentiatorSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
